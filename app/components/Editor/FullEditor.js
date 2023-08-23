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
import QuestionToolbarPlugin from './plugins/QuestionToolbarPlugin';
import AudiosPlugin from './plugins/AudioPlugin';
import { AudioNode } from './nodes/AudioNode';

function Placeholder({ placeholder }) {
    return <div className="editor-placeholder">{placeholder}</div>;
}

const editorConfig = {
    // The editor theme
    theme: Theme,
    // Handling of errors during update
    onError(error) {
        throw error;
    },
    // Any custom nodes go here
    nodes: [ListNode, ListItemNode, CodeNode, CodeHighlightNode, ImageNode, AudioNode, MathNode],
};

export default function FullEditor({ content, onEditorChange, placeholder }) {
    return (
        <LexicalComposer initialConfig={{ ...editorConfig, editorState: content }}>
            <div className="rounded-lg border">
                <QuestionToolbarPlugin />
                <div className="relative">
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable className="editor-input min-h-[100px] border-t py-2 px-3 focus:outline-none" />
                        }
                        placeholder={<Placeholder placeholder={placeholder} />}
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    <OnChangePlugin
                        onChange={(editorState) => {
                            onEditorChange && onEditorChange(editorState);
                            console.log(editorState);
                        }}
                    />
                    <HistoryPlugin />
                    <CodeHighlightPlugin />
                    <ListPlugin />
                    <ImagesPlugin />
                    <AudiosPlugin />
                    <MathPlugin />
                </div>
            </div>
        </LexicalComposer>
    );
}
