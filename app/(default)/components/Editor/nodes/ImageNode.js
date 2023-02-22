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
const SELECT_IMAGE_COMMAND = createCommand('SELECT_IMAGE_COMMAND');
import clsx from 'clsx';

function ImageComponent({ src, nodeKey }) {
    const [editor] = useLexicalComposerContext();
    const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
    const [selection, setSelection] = useState(null);
    const [isEditable, setEditable] = useState(true);
    const ref = useRef(null);

    const deleteImage = useCallback(
        (payload) => {
            if (!editor.isEditable()) return false;
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
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                setSelection(editorState.read(() => $getSelection()));
            }),
            editor.registerEditableListener((isEditable) => {
                setEditable(isEditable);
                console.log('set');
            }),
            editor.registerCommand(
                CLICK_COMMAND,
                (payload) => {
                    if (!editor.isEditable()) return false;

                    const event = payload;

                    if (event.target === ref.current) {
                        setSelected(!isSelected);
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
        <div className="flex justify-center">
            <img
                src={src}
                className={clsx({
                    'ring ring-primary': isFocused,
                })}
                ref={ref}
            />
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
        return document.createElement('div');
    }

    updateDOM() {
        return false;
    }

    isInline() {
        return false;
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
