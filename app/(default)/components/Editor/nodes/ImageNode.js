'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import {
    $createNodeSelection,
    $createRangeSelection,
    $getNodeByKey,
    $setSelection,
    COMMAND_PRIORITY_EDITOR,
    createCommand,
    DecoratorNode,
} from 'lexical';
import { useEffect, useState } from 'react';
const SELECT_IMAGE_COMMAND = createCommand('SELECT_IMAGE_COMMAND');
import clsx from 'clsx';

function ImageComponent({ src, nodeKey }) {
    const [editor] = useLexicalComposerContext();

    // function handleSelect() {
    //     editor.dispatchCommand(SELECT_IMAGE_COMMAND, nodeKey);
    // }

    // useEffect(() => {
    //     editor.registerCommand(
    //         SELECT_IMAGE_COMMAND,
    //         (nodeKey) => {
    //             // Set a node selection
    //             const nodeSelection = $createNodeSelection();
    //             // Add a node key to the selection.
    //             nodeSelection.add(nodeKey);
    //             $setSelection(nodeSelection);
    //         },
    //         COMMAND_PRIORITY_EDITOR
    //     );
    // }, []);

    return (
        <div className="flex justify-center">
            <img
                src={src}
                onClick={handleSelect}
                className={clsx({
                    'ring ring-primary': false,
                })}
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

    decorate() {
        return (
            <div className="flex justify-center">
                <img src={this.__src} />
            </div>
        );
    }
}

export function $createImageNode(src) {
    return new ImageNode(src);
}

export function $isImageNode(node) {
    return node instanceof ImageNode;
}
