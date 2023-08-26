'use client';

import { DecoratorNode } from 'lexical';
import { Suspense } from 'react';

export class AudioNodeReadOnly extends DecoratorNode {
    constructor(src, key) {
        super(key);
        this.__src = src;
    }

    static getType() {
        return 'audio';
    }

    static clone(node) {
        return new AudioNodeReadOnly(node.__src, node.__key);
    }

    static importJSON(serializedNode) {
        const { src } = serializedNode;
        const node = $createAudioNodeReadOnly(src);
        return node;
    }

    exportJSON() {
        return {
            src: this.__src,
            type: 'audio',
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
                <audio src={this.__src} controls />
            </Suspense>
        );
    }
}

export function $createAudioNodeReadOnly(src) {
    return new AudioNodeReadOnly(src);
}

export function $isAudioNodeReadOnly(node) {
    return node instanceof AudioNodeReadOnly;
}
