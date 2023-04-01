'use client';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';

export default function ParseStatePlugin({ content }) {
    const [editor] = useLexicalComposerContext();
    useEffect(() => {
        const initialEditorState = editor.parseEditorState(content);
        editor.setEditorState(initialEditorState);
    }, []);
    return null;
}
