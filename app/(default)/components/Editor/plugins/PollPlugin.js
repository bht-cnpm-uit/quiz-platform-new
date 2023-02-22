import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $wrapNodeInElement } from '@lexical/utils';
import {
    $createParagraphNode,
    $insertNodes,
    $isRootOrShadowRoot,
    COMMAND_PRIORITY_EDITOR,
    createCommand,
    LexicalCommand,
} from 'lexical';
import { useEffect } from 'react';

import { $createPollNode, PollNode } from '../nodes/PollNode';

export const INSERT_POLL_COMMAND = createCommand('INSERT_POLL_COMMAND');

export default function PollPlugin() {
    const [editor] = useLexicalComposerContext();
    useEffect(() => {
        if (!editor.hasNodes([PollNode])) {
            throw new Error('PollPlugin: PollNode not registered on editor');
        }

        return editor.registerCommand(
            INSERT_POLL_COMMAND,
            (payload) => {
                const pollNode = $createPollNode(payload);
                $insertNodes([pollNode]);
                if ($isRootOrShadowRoot(pollNode.getParentOrThrow())) {
                    $wrapNodeInElement(pollNode, $createParagraphNode).selectEnd();
                }

                return true;
            },
            COMMAND_PRIORITY_EDITOR
        );
    }, [editor]);
    return null;
}
