'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { mergeRegister } from '@lexical/utils';
import { autoUpdate, inline, offset, shift, useFloating } from '@floating-ui/react';

import {
    $createNodeSelection,
    $createRangeSelection,
    $getNodeByKey,
    $getSelection,
    $isNodeSelection,
    $setSelection,
    CLICK_COMMAND,
    COMMAND_PRIORITY_EDITOR,
    COMMAND_PRIORITY_HIGH,
    COMMAND_PRIORITY_LOW,
    createCommand,
    DecoratorNode,
    KEY_BACKSPACE_COMMAND,
    KEY_DELETE_COMMAND,
} from 'lexical';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { InlineMath } from 'react-katex';

function FloatingEditMath({ hidden, latex, isInline, onSubmit }) {
    const [value, setValue] = useState(latex);
    const [inline, setInline] = useState(isInline);
    const inputRef = useRef(null);
    function handleKeydown(e) {
        e.stopPropagation();
        if (e.key === 'Enter') {
            inputRef.current.blur();
        }
    }
    return (
        <div
            className={clsx('flex flex-col rounded-lg border bg-white p-2', {
                'hidden ': hidden,
            })}
        >
            <label className="text-sm font-semibold">Định dạng</label>

            <div
                className="ml-2 flex cursor-pointer items-center"
                onClick={() => {
                    setInline(!inline);
                    onSubmit && onSubmit({ latex: value, isInline: !inline });
                }}
            >
                <span className="pr-2 text-primary">
                    {inline ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            className="h-4 w-4"
                            viewBox="0 0 448 512"
                        >
                            <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            stroke="currentColor"
                            className="h-4 w-4"
                            viewBox="0 0 448 512"
                        >
                            <path d="M384 32C419.3 32 448 60.65 448 96V416C448 451.3 419.3 480 384 480H64C28.65 480 0 451.3 0 416V96C0 60.65 28.65 32 64 32H384zM384 80H64C55.16 80 48 87.16 48 96V416C48 424.8 55.16 432 64 432H384C392.8 432 400 424.8 400 416V96C400 87.16 392.8 80 384 80z" />
                        </svg>
                    )}
                </span>
                <p>Trên cùng 1 dòng</p>
            </div>

            <label className="text-sm font-semibold">Latex</label>
            <input
                ref={inputRef}
                className="w-full rounded-md bg-gray-100 px-2 py-1"
                type="text"
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                    onSubmit && onSubmit({ latex: e.target.value, isInline: inline });
                }}
                onKeyDown={handleKeydown}
            />
        </div>
    );
}

function MathComponent({ latex, isInline, nodeKey }) {
    const { x, y, strategy, refs } = useFloating({
        placement: 'bottom',
        middleware: [shift(), offset(3)],
        whileElementsMounted: autoUpdate,
    });
    const [editor] = useLexicalComposerContext();
    const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
    const [selection, setSelection] = useState(null);
    const [isEditable, setEditable] = useState(true);
    const [isMouted, setMouted] = useState(false);
    const ref = useRef(null);

    function changeNode({ latex, isInline }) {
        console.log({ latex, isInline });
        editor.update(() => {
            const mathNode = $getNodeByKey(nodeKey);
            if ($isMathNode(mathNode)) {
                mathNode.setLatex(latex);
                mathNode.setIsInline(isInline);
            }
        });
    }

    const deleteMath = useCallback(
        (payload) => {
            if (isSelected && $isNodeSelection(selection)) {
                const event = payload;
                event.preventDefault();
                const node = $getNodeByKey(nodeKey);
                if ($isMathNode(node)) {
                    node.remove();
                }
                setSelected(false);
            }
            return false;
        },
        [isSelected, nodeKey, setSelected]
    );

    useEffect(() => {
        setSelected(true);
        setMouted(true);
    }, []);

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                setSelection(editorState.read(() => $getSelection()));
            }),
            editor.registerEditableListener((isEditable) => {
                setEditable(isEditable);
            }),
            editor.registerCommand(
                CLICK_COMMAND,
                (payload) => {
                    // if (!editor.isEditable()) return false;

                    const event = payload;
                    if (ref.current.contains(event.target)) {
                        clearSelection();
                        setSelected(true);
                        return true;
                    }
                    return false;
                },
                COMMAND_PRIORITY_LOW
            ),
            editor.registerCommand(KEY_DELETE_COMMAND, deleteMath, COMMAND_PRIORITY_LOW),
            editor.registerCommand(KEY_BACKSPACE_COMMAND, deleteMath, COMMAND_PRIORITY_LOW)
        );
    }, [clearSelection, editor, isSelected, nodeKey, setSelected]);
    const isFocused = !isMouted || ($isNodeSelection(selection) && isSelected && isEditable);
    return (
        <span ref={ref}>
            <span
                className={clsx({
                    'ring-1 ring-primary': isFocused,
                    'flex justify-center': !isInline,
                })}
                ref={refs.setReference}
            >
                <InlineMath math={latex} />
            </span>
            <div
                ref={refs.setFloating}
                className="z-50"
                style={{
                    position: strategy,
                    top: y ?? 0,
                    left: x ?? 0,
                }}
            >
                {<FloatingEditMath hidden={!isFocused} latex={latex} isInline={isInline} onSubmit={changeNode} />}
            </div>
        </span>
    );
}

export class MathNode extends DecoratorNode {
    constructor(latex, isInline, key) {
        super(key);
        this.__latex = latex;
        this.__isInline = isInline;
    }

    static getType() {
        return 'math';
    }

    static clone(node) {
        return new MathNode(node.__latex, node.__key);
    }

    static importJSON(serializedNode) {
        const { latex, isInline } = serializedNode;
        const node = $createMathNode(latex, isInline);
        return node;
    }

    exportJSON() {
        return {
            latex: this.__latex,
            isInline: this.__isInline,
            type: 'math',
            version: 1,
        };
    }

    createDOM() {
        const div = document.createElement('span');
        return div;
    }

    updateDOM() {
        return false;
    }

    isInline() {
        return true;
    }

    setLatex(latex) {
        const writable = this.getWritable();
        writable.__latex = latex;
    }

    setIsInline(isInline) {
        const writable = this.getWritable();
        writable.__isInline = isInline;
    }

    decorate() {
        return (
            <Suspense fallback={null}>
                <MathComponent latex={this.__latex} isInline={this.__isInline} nodeKey={this.__key} />
            </Suspense>
        );
    }
}

export function $createMathNode(latex, isInline) {
    return new MathNode(latex, isInline);
}

export function $isMathNode(node) {
    return node instanceof MathNode;
}
