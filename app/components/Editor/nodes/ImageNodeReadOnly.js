'use client';

import { DecoratorNode } from 'lexical';
import { Suspense } from 'react';

export class ImageNodeReadOnly extends DecoratorNode {
    constructor(src, key) {
        super(key);
        this.__src = src;
    }

    static getType() {
        return 'image';
    }

    static clone(node) {
        return new ImageNodeReadOnly(node.__src, node.__key);
    }

    static importJSON(serializedNode) {
        const { src } = serializedNode;
        const node = $createImageNodeReadOnly(src);
        return node;
    }

    exportJSON() {
        return {
            src: this.__src,
            type: 'image',
            version: 1,
        };
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

    decorate() {
        return (
            <Suspense fallback={null}>
                <img src={this.__src} />
            </Suspense>
        );
    }
}

export function $createImageNodeReadOnly(src) {
    return new ImageNodeReadOnly(src);
}

export function $isImageNodeReadOnly(node) {
    return node instanceof ImageNodeReadOnly;
}
