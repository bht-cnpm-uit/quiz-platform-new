'use client';

import { DecoratorNode } from 'lexical';
import { Suspense } from 'react';
import 'katex/dist/katex.min.css';
import clsx from 'clsx';
import { InlineMath } from 'react-katex';

function MathComponent({ latex, isInline }) {
    return (
        <span
            className={clsx({
                'flex justify-center': !isInline,
            })}
        >
            <InlineMath math={latex} />
        </span>
    );
}

export class MathNodeReadOnly extends DecoratorNode {
    constructor(latex, isInline, key) {
        super(key);
        this.__latex = latex;
        this.__isInline = isInline;
    }

    static getType() {
        return 'math';
    }

    static clone(node) {
        return new MathNodeReadOnly(node.__latex, node.__isInline);
    }

    static importJSON(serializedNode) {
        const { latex, isInline } = serializedNode;
        const node = $createMathNodeReadOnly(latex, isInline);
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

export function $createMathNodeReadOnly(latex, isInline) {
    return new MathNodeReadOnly(latex, isInline);
}

export function $isMathNodeReadOnly(node) {
    return node instanceof MathNodeReadOnly;
}
