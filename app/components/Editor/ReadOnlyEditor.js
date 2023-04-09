'use client';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import CodeHighlightPlugin from '~/app/components/Editor/plugins/CodeHighlightPlugin';
import MathPlugin from '~/app/components/Editor/plugins/MathPlugin';
import exampleTheme from '~/configs/editorThemes/Theme';
import { ImageNodeReadOnly } from '~/app/components/Editor/nodes/ImageNodeReadOnly';
import { MathNodeReadOnly } from './nodes/MathNodeReadOnly';

const editorConfig = {
    // The editor theme
    theme: exampleTheme,
    // Handling of errors during update
    onError(error) {
        throw error;
    },
    editable: false,
    // Any custom nodes go here
    nodes: [ListNode, ListItemNode, CodeNode, CodeHighlightNode, MathNodeReadOnly, ImageNodeReadOnly],
};

export default function ReadOnlyEditor({ content, className }) {
    return (
        <LexicalComposer initialConfig={{ ...editorConfig, editorState: content }}>
            <RichTextPlugin
                contentEditable={<ContentEditable className={className} />}
                ErrorBoundary={LexicalErrorBoundary}
            />
            <CodeHighlightPlugin />
            <ListPlugin />
            {/* <ParseStatePlugin content={content} /> */}
        </LexicalComposer>
    );
}
