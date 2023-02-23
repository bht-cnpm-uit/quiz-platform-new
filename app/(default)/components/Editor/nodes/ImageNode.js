'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { mergeRegister } from '@lexical/utils';

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

function FloatingEditImage({ src, onSubmit }) {
    const [value, setValue] = useState(src);
    const inputRef = useRef(null);
    return (
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center rounded-lg border bg-white p-2">
                <div className="font-bold">Link ảnh</div>
                <input
                    ref={inputRef}
                    className="rounded-md bg-gray-100 px-2 py-1"
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={() => onSubmit(value)}
                    onKeyDown={(e) => e.stopPropagation()}
                />
            </div>
        </div>
    );
}

function ImageComponent({ src, nodeKey }) {
    const [editor] = useLexicalComposerContext();
    const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
    const [selection, setSelection] = useState(null);
    const [isEditable, setEditable] = useState(true);
    const [error, setError] = useState(false);
    const ref = useRef(null);

    function changeSrc(value) {
        editor.update(() => {
            const imageNode = $getNodeByKey(nodeKey);
            if ($isImageNode(imageNode)) {
                console.log(imageNode);
                imageNode.setSrc(value);
            }
        });
    }

    const deleteImage = useCallback(
        (payload) => {
            // if (!editor.isEditable()) return false;
            if (isSelected && $isNodeSelection(selection)) {
                const event = payload;
                event.preventDefault();
                const node = $getNodeByKey(nodeKey);
                if ($isImageNode(node)) {
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
                        setSelected(true);
                        return true;
                    }
                    return false;
                },
                COMMAND_PRIORITY_LOW
            ),
            editor.registerCommand(KEY_DELETE_COMMAND, deleteImage, COMMAND_PRIORITY_LOW),
            editor.registerCommand(KEY_BACKSPACE_COMMAND, deleteImage, COMMAND_PRIORITY_LOW)
        );
    }, [clearSelection, editor, isSelected, nodeKey, setSelected]);
    const isFocused = $isNodeSelection(selection) && isSelected && isEditable;
    return (
        <div className="relative" ref={ref}>
            <img
                src={src}
                className={clsx({
                    'ring ring-primary': isFocused,
                })}
                // onError={() => setError(true)}
                // onLoad={() => setError(false)}
            />
            {/* {error && <div className="h-[100px] bg-gray-200"></div>} */}
            {isFocused && <FloatingEditImage src={src} onSubmit={changeSrc} />}
        </div>
    );
}

export class ImageNode extends DecoratorNode {
    constructor(src, key) {
        super(key);
        this.__src = src;
    }

    static getType() {
        return 'image';
    }

    static clone(node) {
        return new ImageNode(node.__src, node.__key);
    }

    createDOM() {
        const div = document.createElement('div');
        div.className = 'flex justify-center';
        return div;
    }

    updateDOM() {
        return false;
    }

    isInline() {
        return false;
    }

    setSrc(src) {
        const writable = this.getWritable();
        writable.__src = src;
    }

    decorate() {
        return (
            <Suspense fallback={null}>
                <ImageComponent src={this.__src} nodeKey={this.__key} />
            </Suspense>
        );
    }
}

export function $createImageNode(src) {
    return new ImageNode(src);
}

export function $isImageNode(node) {
    return node instanceof ImageNode;
}
