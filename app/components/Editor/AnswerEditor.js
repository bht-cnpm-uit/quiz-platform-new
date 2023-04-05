'use client';

import Theme from '../../../configs/editorThemes/Theme';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { CodeNode } from '@lexical/code';

import MathPlugin from './plugins/MathPlugin';
import { MathNode } from './nodes/MathNode';
import AnswerToolbarPlugin from './plugins/AnswerToolbarPlugin';

function Placeholder() {
    return <div className="editor-placeholder">Câu trả lời ...</div>;
}

const editorConfig = {
    // The editor theme
    theme: Theme,
    // Handling of errors during update
    onError(error) {
        throw error;
    },
    // Any custom nodes go here
    nodes: [CodeNode, MathNode],
};

export default function AnswerEditor({ content, onEditorChange }) {
    return (
        <LexicalComposer initialConfig={{ ...editorConfig, editorState: content }}>
            <div className="rounded-lg border">
                <AnswerToolbarPlugin />
                <div className="relative">
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable className="editor-input min-h-[50px] border-t py-2 px-3 focus:outline-none" />
                        }
                        placeholder={<Placeholder />}
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    <OnChangePlugin onChange={(editorState) => onEditorChange && onEditorChange(editorState)} />
                    <MathPlugin />
                </div>
            </div>
        </LexicalComposer>
    );
}
