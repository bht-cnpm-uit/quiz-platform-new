'use client';

import Theme from '../../../configs/editorThemes/Theme';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import TreeViewPlugin from './plugins/TreeViewPlugin';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';

import CodeHighlightPlugin from './plugins/CodeHighlightPlugin';
import ImagesPlugin from './plugins/ImagePlugin';
import { ImageNode } from './nodes/ImageNode';
import MathPlugin from './plugins/MathPlugin';
import { MathNode } from './nodes/MathNode';

function Placeholder() {
    return <div className="editor-placeholder">Enter some rich text...</div>;
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

export default function Editor() {
    return (
        <LexicalComposer initialConfig={editorConfig}>
            <div className="rounded-lg">
                <ToolbarPlugin />
                <div className="relative">
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable className="editor-input min-h-[150px] border py-2 px-3 focus:outline-none" />
                        }
                        placeholder={<Placeholder />}
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    <HistoryPlugin />
                    <TreeViewPlugin />
                    <AutoFocusPlugin />
                    <CodeHighlightPlugin />
                    <ListPlugin />
                    <ImagesPlugin />
                    <MathPlugin />
                    {/* <MarkdownShortcutPlugin transformers={TRANSFORMERS} /> */}
                </div>
            </div>
        </LexicalComposer>
    );
}
