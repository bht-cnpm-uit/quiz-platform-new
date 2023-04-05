'use client';

import Theme from '../../../configs/editorThemes/Theme';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';

import CodeHighlightPlugin from './plugins/CodeHighlightPlugin';
import ImagesPlugin from './plugins/ImagePlugin';
import { ImageNode } from './nodes/ImageNode';
import MathPlugin from './plugins/MathPlugin';
import { MathNode } from './nodes/MathNode';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import QuestionToolbarPlugin from './plugins/QuestionToolbarPlugin';

function Placeholder() {
    return <div className="editor-placeholder">Nội dung câu hỏi ...</div>;
}

const editorConfig = {
    // The editor theme
    theme: Theme,
    // Handling of errors during update
    onError(error) {
        throw error;
    },
    // Any custom nodes go here
    nodes: [ListNode, ListItemNode, CodeNode, CodeHighlightNode, ImageNode, MathNode],
};

export default function QuestionEditor({ content, onEditorChange }) {
    return (
        <LexicalComposer initialConfig={{ ...editorConfig, editorState: content }}>
            <div className="rounded-lg border">
                <QuestionToolbarPlugin />
                <div className="relative">
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable className="editor-input min-h-[100px] border-t py-2 px-3 focus:outline-none" />
                        }
                        placeholder={<Placeholder />}
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    <OnChangePlugin onChange={(editorState) => onEditorChange && onEditorChange(editorState)} />
                    <HistoryPlugin />
                    <CodeHighlightPlugin />
                    <ListPlugin />
                    <ImagesPlugin />
                    <MathPlugin />
                </div>
            </div>
        </LexicalComposer>
    );
}
