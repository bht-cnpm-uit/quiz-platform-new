import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import CodeHighlightPlugin from '~/app/components/Editor/plugins/CodeHighlightPlugin';
import MathPlugin from '~/app/components/Editor/plugins/MathPlugin';
import { MathNode } from '~/app/components/Editor/nodes/MathNode';
import exampleTheme from '~/configs/editorThemes/Theme';
import { ImageNodeReadOnly } from '~/app/components/Editor/nodes/ImageNodeReadOnly';
import ParseStatePlugin from '~/app/components/Editor/plugins/ParseStatePlugin';

const editorConfig = {
    // The editor theme
    theme: exampleTheme,
    // Handling of errors during update
    onError(error) {
        throw error;
    },
    editable: false,
    // Any custom nodes go here
    nodes: [ListNode, ListItemNode, CodeNode, CodeHighlightNode, MathNode, ImageNodeReadOnly],
};

export default function ReadOnlyEditor({ content, className }) {
    return (
        <LexicalComposer initialConfig={editorConfig}>
            <RichTextPlugin
                contentEditable={<ContentEditable className={className} />}
                ErrorBoundary={LexicalErrorBoundary}
            />
            <CodeHighlightPlugin />
            <ListPlugin />
            <MathPlugin />
            <ParseStatePlugin content={content} />
        </LexicalComposer>
    );
}
