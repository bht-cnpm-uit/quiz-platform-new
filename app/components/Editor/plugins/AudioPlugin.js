'use client';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $wrapNodeInElement, mergeRegister } from '@lexical/utils';
import {
    $createParagraphNode,
    $insertNodes,
    $isRootOrShadowRoot,
    COMMAND_PRIORITY_EDITOR,
    createCommand,
} from 'lexical';
import { useEffect } from 'react';

import { $createAudioNode, AudioNode } from '../nodes/AudioNode';

export const INSERT_AUDIO_COMMAND = createCommand('INSERT_AUDIO_COMMAND');

export default function AudiosPlugin() {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        if (!editor.hasNodes([AudioNode])) {
            throw new Error('AudiosPlugin: AudioNode not registered on editor');
        }

        return mergeRegister(
            editor.registerCommand(
                INSERT_AUDIO_COMMAND,
                (payload) => {
                    const audioNode = $createAudioNode(payload);
                    $insertNodes([audioNode]);
                    if ($isRootOrShadowRoot(audioNode.getParentOrThrow())) {
                        $wrapNodeInElement(audioNode, $createParagraphNode).selectEnd();
                    }

                    return true;
                },
                COMMAND_PRIORITY_EDITOR
            )
        );
    }, [editor]);

    return null;
}
