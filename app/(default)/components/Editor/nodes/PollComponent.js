import './a.css';

import { useCollaborationContext } from '@lexical/react/LexicalCollaborationContext';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { mergeRegister } from '@lexical/utils';
import {
    $getNodeByKey,
    $getSelection,
    $isNodeSelection,
    CLICK_COMMAND,
    COMMAND_PRIORITY_LOW,
    GridSelection,
    KEY_BACKSPACE_COMMAND,
    KEY_DELETE_COMMAND,
    NodeSelection,
    RangeSelection,
} from 'lexical';
import * as React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { $isPollNode, createPollOption } from './PollNode';

function joinClasses(...args) {
    return args.filter(Boolean).join(' ');
}

function getTotalVotes(options) {
    return options.reduce((totalVotes, next) => {
        return totalVotes + next.votes.length;
    }, 0);
}

export default function PollComponent({ question, options, nodeKey }) {
    const [editor] = useLexicalComposerContext();
    const totalVotes = useMemo(() => getTotalVotes(options), [options]);
    const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
    const [selection, setSelection] = useState(null);
    const ref = useRef(null);

    const onDelete = useCallback(
        (payload) => {
            if (isSelected && $isNodeSelection($getSelection())) {
                const event = payload;
                event.preventDefault();
                const node = $getNodeByKey(nodeKey);
                if ($isPollNode(node)) {
                    node.remove();
                }
                setSelected(false);
            }
            return false;
        },
        [isSelected, nodeKey, setSelected]
    );

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                setSelection(editorState.read(() => $getSelection()));
            }),
            editor.registerCommand(
                CLICK_COMMAND,
                (payload) => {
                    const event = payload;

                    if (event.target === ref.current) {
                        if (!event.shiftKey) {
                            clearSelection();
                        }
                        setSelected(!isSelected);
                        return true;
                    }

                    return false;
                },
                COMMAND_PRIORITY_LOW
            ),
            editor.registerCommand(KEY_DELETE_COMMAND, onDelete, COMMAND_PRIORITY_LOW),
            editor.registerCommand(KEY_BACKSPACE_COMMAND, onDelete, COMMAND_PRIORITY_LOW)
        );
    }, [clearSelection, editor, isSelected, nodeKey, onDelete, setSelected]);

    const withPollNode = (cb) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            if ($isPollNode(node)) {
                cb(node);
            }
        });
    };

    const addOption = () => {
        withPollNode((node) => {
            node.addOption(createPollOption());
        });
    };

    const isFocused = $isNodeSelection(selection) && isSelected;

    return (
        <div className={`PollNode__container ${isFocused ? 'focused' : ''}`} ref={ref}>
            <div className="PollNode__inner">
                <h2 className="PollNode__heading">{question}</h2>
                <div></div>
            </div>
        </div>
    );
}
