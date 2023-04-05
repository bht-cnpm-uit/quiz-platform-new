'use client';

import clsx from 'clsx';
import AnswerEditor from '~/app/components/Editor/AnswerEditor';
import ReadOnlyEditor from '~/app/components/Editor/ReadOnlyEditor';

export default function AnswerCard({
    content,
    isCorrectAnswer,
    editing,
    onEditorChange,
    onDelete,
    onCorrectAnswerChange,
}) {
    return (
        <div className="my-2 flex items-center">
            {editing && (
                <div
                    className={clsx('cursor-pointer pr-2', {
                        'text-green-500': isCorrectAnswer,
                    })}
                    onClick={onCorrectAnswerChange}
                >
                    {isCorrectAnswer ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-8 w-8"
                        >
                            <path
                                fillRule="evenodd"
                                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                                clipRule="evenodd"
                            />
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="h-8 w-8"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    )}
                </div>
            )}
            <div className="flex-1">
                {editing ? (
                    <AnswerEditor content={content} onEditorChange={onEditorChange} />
                ) : (
                    <div
                        className={clsx('rounded border p-2', {
                            'border-green-500 bg-green-500/10': isCorrectAnswer,
                        })}
                    >
                        <ReadOnlyEditor content={content} />
                    </div>
                )}
            </div>
            {editing && (
                <button className="ml-2 rounded bg-red-500 px-2 py-2 text-white hover:bg-red-600" onClick={onDelete}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                        <path
                            fillRule="evenodd"
                            d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            )}
        </div>
    );
}
