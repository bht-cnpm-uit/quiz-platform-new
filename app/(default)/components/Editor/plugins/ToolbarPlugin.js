'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    CAN_REDO_COMMAND,
    CAN_UNDO_COMMAND,
    REDO_COMMAND,
    UNDO_COMMAND,
    SELECTION_CHANGE_COMMAND,
    FORMAT_TEXT_COMMAND,
    FORMAT_ELEMENT_COMMAND,
    $getSelection,
    $isRangeSelection,
    $createParagraphNode,
    $getNodeByKey,
} from 'lexical';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { $isParentElementRTL, $wrapNodes, $isAtNodeEnd } from '@lexical/selection';
import { $getNearestNodeOfType, mergeRegister } from '@lexical/utils';
import {
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
    REMOVE_LIST_COMMAND,
    $isListNode,
    ListNode,
} from '@lexical/list';
import { createPortal } from 'react-dom';
import { $createHeadingNode, $createQuoteNode, $isHeadingNode } from '@lexical/rich-text';
import { $createCodeNode, $isCodeNode, getDefaultCodeLanguage, getCodeLanguages } from '@lexical/code';

const LowPriority = 1;

const supportedBlockTypes = new Set(['paragraph', 'quote', 'code', 'h1', 'h2', 'ul', 'ol']);

const blockTypeToBlockName = {
    code: 'Code Block',
    h1: 'Large Heading',
    h2: 'Small Heading',
    h3: 'Heading',
    h4: 'Heading',
    h5: 'Heading',
    ol: 'Numbered List',
    paragraph: 'Normal',
    quote: 'Quote',
    ul: 'Bulleted List',
};

function Divider() {
    return <div className="divider" />;
}

function positionEditorElement(editor, rect) {
    if (rect === null) {
        editor.style.opacity = '0';
        editor.style.top = '-1000px';
        editor.style.left = '-1000px';
    } else {
        editor.style.opacity = '1';
        editor.style.top = `${rect.top + rect.height + window.pageYOffset + 10}px`;
        editor.style.left = `${rect.left + window.pageXOffset - editor.offsetWidth / 2 + rect.width / 2}px`;
    }
}

function FloatingLinkEditor({ editor }) {
    const editorRef = useRef(null);
    const inputRef = useRef(null);
    const mouseDownRef = useRef(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [isEditMode, setEditMode] = useState(false);
    const [lastSelection, setLastSelection] = useState(null);

    const updateLinkEditor = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            const node = getSelectedNode(selection);
            const parent = node.getParent();
            if ($isLinkNode(parent)) {
                setLinkUrl(parent.getURL());
            } else if ($isLinkNode(node)) {
                setLinkUrl(node.getURL());
            } else {
                setLinkUrl('');
            }
        }
        const editorElem = editorRef.current;
        const nativeSelection = window.getSelection();
        const activeElement = document.activeElement;

        if (editorElem === null) {
            return;
        }

        const rootElement = editor.getRootElement();
        if (
            selection !== null &&
            !nativeSelection.isCollapsed &&
            rootElement !== null &&
            rootElement.contains(nativeSelection.anchorNode)
        ) {
            const domRange = nativeSelection.getRangeAt(0);
            let rect;
            if (nativeSelection.anchorNode === rootElement) {
                let inner = rootElement;
                while (inner.firstElementChild != null) {
                    inner = inner.firstElementChild;
                }
                rect = inner.getBoundingClientRect();
            } else {
                rect = domRange.getBoundingClientRect();
            }

            if (!mouseDownRef.current) {
                positionEditorElement(editorElem, rect);
            }
            setLastSelection(selection);
        } else if (!activeElement || activeElement.className !== 'link-input') {
            positionEditorElement(editorElem, null);
            setLastSelection(null);
            setEditMode(false);
            setLinkUrl('');
        }

        return true;
    }, [editor]);

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    updateLinkEditor();
                });
            }),

            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                () => {
                    updateLinkEditor();
                    return true;
                },
                LowPriority
            )
        );
    }, [editor, updateLinkEditor]);

    useEffect(() => {
        editor.getEditorState().read(() => {
            updateLinkEditor();
        });
    }, [editor, updateLinkEditor]);

    useEffect(() => {
        if (isEditMode && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditMode]);

    return (
        <div ref={editorRef} className="link-editor">
            {isEditMode ? (
                <input
                    ref={inputRef}
                    className="link-input"
                    value={linkUrl}
                    onChange={(event) => {
                        setLinkUrl(event.target.value);
                    }}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            event.preventDefault();
                            if (lastSelection !== null) {
                                if (linkUrl !== '') {
                                    editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
                                }
                                setEditMode(false);
                            }
                        } else if (event.key === 'Escape') {
                            event.preventDefault();
                            setEditMode(false);
                        }
                    }}
                />
            ) : (
                <>
                    <div className="link-input">
                        <a href={linkUrl} target="_blank" rel="noopener noreferrer">
                            {linkUrl}
                        </a>
                        <div
                            className="link-edit"
                            role="button"
                            tabIndex={0}
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => {
                                setEditMode(true);
                            }}
                        />
                    </div>
                </>
            )}
        </div>
    );
}

function Select({ onChange, className, options, value }) {
    return (
        <select className={className} onChange={onChange} value={value}>
            <option hidden={true} value="" />
            {options.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    );
}

function getSelectedNode(selection) {
    const anchor = selection.anchor;
    const focus = selection.focus;
    const anchorNode = selection.anchor.getNode();
    const focusNode = selection.focus.getNode();
    if (anchorNode === focusNode) {
        return anchorNode;
    }
    const isBackward = selection.isBackward();
    if (isBackward) {
        return $isAtNodeEnd(focus) ? anchorNode : focusNode;
    } else {
        return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
    }
}

function BlockOptionsDropdownList({ editor, blockType, toolbarRef, setShowBlockOptionsDropDown }) {
    const dropDownRef = useRef(null);

    useEffect(() => {
        const toolbar = toolbarRef.current;
        const dropDown = dropDownRef.current;

        if (toolbar !== null && dropDown !== null) {
            const { top, left } = toolbar.getBoundingClientRect();
            dropDown.style.top = `${top + 40}px`;
            dropDown.style.left = `${left}px`;
        }
    }, [dropDownRef, toolbarRef]);

    useEffect(() => {
        const dropDown = dropDownRef.current;
        const toolbar = toolbarRef.current;

        if (dropDown !== null && toolbar !== null) {
            const handle = (event) => {
                const target = event.target;

                if (!dropDown.contains(target) && !toolbar.contains(target)) {
                    setShowBlockOptionsDropDown(false);
                }
            };
            document.addEventListener('click', handle);

            return () => {
                document.removeEventListener('click', handle);
            };
        }
    }, [dropDownRef, setShowBlockOptionsDropDown, toolbarRef]);

    const formatParagraph = () => {
        if (blockType !== 'paragraph') {
            editor.update(() => {
                const selection = $getSelection();

                if ($isRangeSelection(selection)) {
                    $wrapNodes(selection, () => $createParagraphNode());
                }
            });
        }
        setShowBlockOptionsDropDown(false);
    };

    const formatLargeHeading = () => {
        if (blockType !== 'h1') {
            editor.update(() => {
                const selection = $getSelection();

                if ($isRangeSelection(selection)) {
                    $wrapNodes(selection, () => $createHeadingNode('h1'));
                }
            });
        }
        setShowBlockOptionsDropDown(false);
    };

    const formatSmallHeading = () => {
        if (blockType !== 'h2') {
            editor.update(() => {
                const selection = $getSelection();

                if ($isRangeSelection(selection)) {
                    $wrapNodes(selection, () => $createHeadingNode('h2'));
                }
            });
        }
        setShowBlockOptionsDropDown(false);
    };

    const formatBulletList = () => {
        if (blockType !== 'ul') {
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND);
        } else {
            editor.dispatchCommand(REMOVE_LIST_COMMAND);
        }
        setShowBlockOptionsDropDown(false);
    };

    const formatNumberedList = () => {
        if (blockType !== 'ol') {
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND);
        } else {
            editor.dispatchCommand(REMOVE_LIST_COMMAND);
        }
        setShowBlockOptionsDropDown(false);
    };

    const formatQuote = () => {
        if (blockType !== 'quote') {
            editor.update(() => {
                const selection = $getSelection();

                if ($isRangeSelection(selection)) {
                    $wrapNodes(selection, () => $createQuoteNode());
                }
            });
        }
        setShowBlockOptionsDropDown(false);
    };

    const formatCode = () => {
        if (blockType !== 'code') {
            editor.update(() => {
                const selection = $getSelection();

                if ($isRangeSelection(selection)) {
                    $wrapNodes(selection, () => $createCodeNode());
                }
            });
        }
        setShowBlockOptionsDropDown(false);
    };

    return (
        <div className="dropdown" ref={dropDownRef}>
            <button className="item" onClick={formatParagraph}>
                <span className="icon paragraph" />
                <span className="text">Normal</span>
                {blockType === 'paragraph' && <span className="active" />}
            </button>
            <button className="item" onClick={formatLargeHeading}>
                <span className="icon large-heading" />
                <span className="text">Large Heading</span>
                {blockType === 'h1' && <span className="active" />}
            </button>
            <button className="item" onClick={formatSmallHeading}>
                <span className="icon small-heading" />
                <span className="text">Small Heading</span>
                {blockType === 'h2' && <span className="active" />}
            </button>
            <button className="item" onClick={formatBulletList}>
                <span className="icon bullet-list" />
                <span className="text">Bullet List</span>
                {blockType === 'ul' && <span className="active" />}
            </button>
            <button className="item" onClick={formatNumberedList}>
                <span className="icon numbered-list" />
                <span className="text">Numbered List</span>
                {blockType === 'ol' && <span className="active" />}
            </button>
            <button className="item" onClick={formatQuote}>
                <span className="icon quote" />
                <span className="text">Quote</span>
                {blockType === 'quote' && <span className="active" />}
            </button>
            <button className="item" onClick={formatCode}>
                <span className="icon code" />
                <span className="text">Code Block</span>
                {blockType === 'code' && <span className="active" />}
            </button>
        </div>
    );
}

export default function ToolbarPlugin() {
    const [editor] = useLexicalComposerContext();
    const toolbarRef = useRef(null);
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const [blockType, setBlockType] = useState('paragraph');
    const [selectedElementKey, setSelectedElementKey] = useState(null);
    const [showBlockOptionsDropDown, setShowBlockOptionsDropDown] = useState(false);
    const [codeLanguage, setCodeLanguage] = useState('');
    const [isRTL, setIsRTL] = useState(false);
    const [isLink, setIsLink] = useState(false);
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isStrikethrough, setIsStrikethrough] = useState(false);
    const [isCode, setIsCode] = useState(false);

    const updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            const anchorNode = selection.anchor.getNode();
            const element = anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getTopLevelElementOrThrow();
            const elementKey = element.getKey();
            const elementDOM = editor.getElementByKey(elementKey);
            if (elementDOM !== null) {
                setSelectedElementKey(elementKey);
                if ($isListNode(element)) {
                    const parentList = $getNearestNodeOfType(anchorNode, ListNode);
                    const type = parentList ? parentList.getTag() : element.getTag();
                    setBlockType(type);
                } else {
                    const type = $isHeadingNode(element) ? element.getTag() : element.getType();
                    setBlockType(type);
                    if ($isCodeNode(element)) {
                        setCodeLanguage(element.getLanguage() || getDefaultCodeLanguage());
                    }
                }
            }
            // Update text format
            setIsBold(selection.hasFormat('bold'));
            setIsItalic(selection.hasFormat('italic'));
            setIsUnderline(selection.hasFormat('underline'));
            setIsStrikethrough(selection.hasFormat('strikethrough'));
            setIsCode(selection.hasFormat('code'));
            setIsRTL($isParentElementRTL(selection));

            // Update links
            const node = getSelectedNode(selection);
            const parent = node.getParent();
            if ($isLinkNode(parent) || $isLinkNode(node)) {
                setIsLink(true);
            } else {
                setIsLink(false);
            }
        }
    }, [editor]);

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    updateToolbar();
                });
            }),
            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                (_payload, newEditor) => {
                    updateToolbar();
                    return false;
                },
                LowPriority
            ),
            editor.registerCommand(
                CAN_UNDO_COMMAND,
                (payload) => {
                    setCanUndo(payload);
                    return false;
                },
                LowPriority
            ),
            editor.registerCommand(
                CAN_REDO_COMMAND,
                (payload) => {
                    setCanRedo(payload);
                    return false;
                },
                LowPriority
            )
        );
    }, [editor, updateToolbar]);

    const codeLanguges = useMemo(() => getCodeLanguages(), []);
    const onCodeLanguageSelect = useCallback(
        (e) => {
            editor.update(() => {
                if (selectedElementKey !== null) {
                    const node = $getNodeByKey(selectedElementKey);
                    if ($isCodeNode(node)) {
                        node.setLanguage(e.target.value);
                    }
                }
            });
        },
        [editor, selectedElementKey]
    );

    const insertLink = useCallback(() => {
        if (!isLink) {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://');
        } else {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
        }
    }, [editor, isLink]);

    return (
        <div className="flex p-1 text-gray-600" ref={toolbarRef}>
            <button
                disabled={!canUndo}
                onClick={() => {
                    editor.dispatchCommand(UNDO_COMMAND);
                }}
                className="rounded-lg px-2 py-1.5 hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-50"
                aria-label="Undo"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="h-5 w-5" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z" />
                    <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z" />
                </svg>
            </button>
            <button
                disabled={!canRedo}
                onClick={() => {
                    editor.dispatchCommand(REDO_COMMAND);
                }}
                className="rounded-lg px-2 py-1.5 hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-50"
                aria-label="Redo"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="h-5 w-5" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />
                    <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
                </svg>
            </button>
            <Divider />
            {supportedBlockTypes.has(blockType) && (
                <>
                    <button
                        className="block-controls rounded-lg px-2 py-1.5 hover:bg-gray-100"
                        onClick={() => setShowBlockOptionsDropDown(!showBlockOptionsDropDown)}
                        aria-label="Formatting Options"
                    >
                        <span className={'icon block-type ' + blockType} />
                        <span className="text">{blockTypeToBlockName[blockType]}</span>
                        <i className="chevron-down" />
                    </button>
                    {showBlockOptionsDropDown &&
                        createPortal(
                            <BlockOptionsDropdownList
                                editor={editor}
                                blockType={blockType}
                                toolbarRef={toolbarRef}
                                setShowBlockOptionsDropDown={setShowBlockOptionsDropDown}
                            />,
                            document.body
                        )}
                    <Divider />
                </>
            )}
            {blockType === 'code' ? (
                <>
                    <Select
                        className="code-language rounded-lg px-2 py-1.5 hover:bg-gray-100"
                        onChange={onCodeLanguageSelect}
                        options={codeLanguges}
                        value={codeLanguage}
                    />
                    <i className="chevron-down inside" />
                </>
            ) : (
                <>
                    <button
                        onClick={() => {
                            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
                        }}
                        className={' rounded-lg px-2 py-1.5 hover:bg-gray-100 ' + (isBold ? 'active' : '')}
                        aria-label="Format Bold"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                        >
                            <path d="M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13H8.21zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908V4.673zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H5.907z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => {
                            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
                        }}
                        className={' rounded-lg px-2 py-1.5 hover:bg-gray-100 ' + (isItalic ? 'active' : '')}
                        aria-label="Format Italics"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                        >
                            <path d="M7.991 11.674 9.53 4.455c.123-.595.246-.71 1.347-.807l.11-.52H7.211l-.11.52c1.06.096 1.128.212 1.005.807L6.57 11.674c-.123.595-.246.71-1.346.806l-.11.52h3.774l.11-.52c-1.06-.095-1.129-.211-1.006-.806z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => {
                            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
                        }}
                        className={' rounded-lg px-2 py-1.5 hover:bg-gray-100 ' + (isUnderline ? 'active' : '')}
                        aria-label="Format Underline"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                        >
                            <path d="M5.313 3.136h-1.23V9.54c0 2.105 1.47 3.623 3.917 3.623s3.917-1.518 3.917-3.623V3.136h-1.23v6.323c0 1.49-.978 2.57-2.687 2.57-1.709 0-2.687-1.08-2.687-2.57V3.136zM12.5 15h-9v-1h9v1z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => {
                            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
                        }}
                        className={' rounded-lg px-2 py-1.5 hover:bg-gray-100 ' + (isStrikethrough ? 'active' : '')}
                        aria-label="Format Strikethrough"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="h-5 w-5" viewBox="0 0 16 16">
                            <path d="M6.333 5.686c0 .31.083.581.27.814H5.166a2.776 2.776 0 0 1-.099-.76c0-1.627 1.436-2.768 3.48-2.768 1.969 0 3.39 1.175 3.445 2.85h-1.23c-.11-1.08-.964-1.743-2.25-1.743-1.23 0-2.18.602-2.18 1.607zm2.194 7.478c-2.153 0-3.589-1.107-3.705-2.81h1.23c.144 1.06 1.129 1.703 2.544 1.703 1.34 0 2.31-.705 2.31-1.675 0-.827-.547-1.374-1.914-1.675L8.046 8.5H1v-1h14v1h-3.504c.468.437.675.994.675 1.697 0 1.826-1.436 2.967-3.644 2.967z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => {
                            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
                        }}
                        className={' rounded-lg px-2 py-1.5 hover:bg-gray-100 ' + (isCode ? 'active' : '')}
                        aria-label="Insert Code"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            className="h-5 w-5"
                            viewBox="0 0 16 16"
                        >
                            <path d="M5.854 4.854a.5.5 0 1 0-.708-.708l-3.5 3.5a.5.5 0 0 0 0 .708l3.5 3.5a.5.5 0 0 0 .708-.708L2.707 8l3.147-3.146zm4.292 0a.5.5 0 0 1 .708-.708l3.5 3.5a.5.5 0 0 1 0 .708l-3.5 3.5a.5.5 0 0 1-.708-.708L13.293 8l-3.147-3.146z" />
                        </svg>
                    </button>
                    <button
                        onClick={insertLink}
                        className={' rounded-lg px-2 py-1.5 hover:bg-gray-100 ' + (isLink ? 'active' : '')}
                        aria-label="Insert Link"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="h-5 w-5" viewBox="0 0 16 16">
                            <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9c-.086 0-.17.01-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z" />
                            <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4.02 4.02 0 0 1-.82 1H12a3 3 0 1 0 0-6H9z" />
                        </svg>
                    </button>
                    {isLink && createPortal(<FloatingLinkEditor editor={editor} />, document.body)}
                    <Divider />
                    <button
                        onClick={() => {
                            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
                        }}
                        className=" rounded-lg px-2 py-1.5 hover:bg-gray-100"
                        aria-label="Left Align"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="h-5 w-5" viewBox="0 0 16 16">
                            <path
                                fillRule="evenodd"
                                d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
                            />
                        </svg>
                    </button>
                    <button
                        onClick={() => {
                            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
                        }}
                        className=" rounded-lg px-2 py-1.5 hover:bg-gray-100"
                        aria-label="Center Align"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="h-5 w-5" viewBox="0 0 16 16">
                            <path
                                fillRule="evenodd"
                                d="M4 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
                            />
                        </svg>
                    </button>
                    <button
                        onClick={() => {
                            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
                        }}
                        className=" rounded-lg px-2 py-1.5 hover:bg-gray-100"
                        aria-label="Right Align"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="h-5 w-5" viewBox="0 0 16 16">
                            <path
                                fillRule="evenodd"
                                d="M6 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm4-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
                            />
                        </svg>
                    </button>
                    <button
                        onClick={() => {
                            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
                        }}
                        className="rounded-lg px-2 py-1.5 hover:bg-gray-100"
                        aria-label="Justify Align"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="h-5 w-5" viewBox="0 0 16 16">
                            <path
                                fillRule="evenodd"
                                d="M2 12.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
                            />
                        </svg>
                    </button>{' '}
                </>
            )}
        </div>
    );
}
