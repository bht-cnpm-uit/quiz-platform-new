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

import { $createMathNode, MathNode } from '../nodes/MathNode';

export const INSERT_MATH_COMMAND = createCommand('INSERT_MATH_COMMAND');

export default function MathPlugin({ captionsEnabled }) {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        if (!editor.hasNodes([MathNode])) {
            throw new Error('MathPlugin: MathNode not registered on editor');
        }

        return mergeRegister(
            editor.registerCommand(
                INSERT_MATH_COMMAND,
                (payload) => {
                    const mathNode = $createMathNode(payload.latex, payload.isInline);
                    $insertNodes([mathNode]);
                    if ($isRootOrShadowRoot(mathNode.getParentOrThrow())) {
                        $wrapNodeInElement(mathNode, $createParagraphNode).selectEnd();
                    }

                    return true;
                },
                COMMAND_PRIORITY_EDITOR
            )
        );
    }, [captionsEnabled, editor]);

    return null;
}
