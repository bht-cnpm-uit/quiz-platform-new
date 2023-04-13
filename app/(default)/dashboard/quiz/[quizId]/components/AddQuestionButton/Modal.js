'use client';

import { useState } from 'react';
import Answer from './Answer';
import placeholderQuestion from '~/data/placeholderQuestion';
import { toast } from 'react-toastify';
import { db } from '~/configs/firebase';
import clsx from 'clsx';
import FullEditor from '~/app/components/Editor/FullEditor';
import { nanoid } from 'nanoid';
import { addDoc, collection } from 'firebase/firestore';

export default function Modal({ quizId, setIsOpen, questions }) {
    const [question, setQuestion] = useState(structuredClone(placeholderQuestion));
    const [loading, setLoading] = useState(false);
    const createSuccessNotify = () => toast.success('Tạo câu hỏi thành công!');
    const errorNotify = () => toast.error('Có lỗi xảy ra!');

    async function handleCreateQuestion() {
        const questionsCollectionRef = collection(db, 'quizzes', quizId, 'questions');
        setLoading(true);
        const newIndex = (questions[questions.length - 1]?.index ?? 0) + 1024;
        const newQuestionDocRef = await addDoc(questionsCollectionRef, { ...question, index: newIndex });
        setLoading(false);
        if (newQuestionDocRef) {
            createSuccessNotify();
            setIsOpen(false);
        } else {
            errorNotify();
        }
    }

    function handleContentQuestionChange(editorState) {
        const newQuestion = structuredClone(question);
        newQuestion.content = JSON.stringify(editorState.toJSON());
        setQuestion(newQuestion);
    }

    // Hint handler
    function handleHintChange(editorState) {
        const newQuestion = structuredClone(question);
        newQuestion.hint = JSON.stringify(editorState.toJSON());
        setQuestion(newQuestion);
    }

    function handleAddHint() {
        const newQuestion = structuredClone(question);
        newQuestion.hint = `{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Phần gợi ý ...","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}`;
        setQuestion(newQuestion);
    }

    function handleDeleteHint() {
        const newQuestion = structuredClone(question);
        delete newQuestion.hint;
        setQuestion(newQuestion);
        console.log(newQuestion);
    }

    // Explanation handler
    function handleExplanationChange(editorState) {
        const newQuestion = structuredClone(question);
        newQuestion.explanation = JSON.stringify(editorState.toJSON());
        setQuestion(newQuestion);
    }

    function handleAddExplanation() {
        const newQuestion = structuredClone(question);
        newQuestion.explanation = `{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Phần giải thích ...","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}`;
        setQuestion(newQuestion);
    }

    function handleDeleteExplanation() {
        const newQuestion = structuredClone(question);
        delete newQuestion.explanation;
        setQuestion(newQuestion);
        console.log(newQuestion);
    }

    // Answer handler

    function handleAnswerChange(index, editorState) {
        const newQuestion = structuredClone(question);
        if (newQuestion.answers[index] !== undefined) {
            newQuestion.answers[index].content = JSON.stringify(editorState.toJSON());
        }
        setQuestion(newQuestion);
    }

    function handleAnswerDelete(index) {
        const newQuestion = structuredClone(question);
        newQuestion.answers.splice(index, 1);
        setQuestion(newQuestion);
    }

    function handleCorrectAnswerChange(id) {
        const newQuestion = structuredClone(question);
        newQuestion.correctAnswer = id;
        setQuestion(newQuestion);
    }

    function handleAddAnswer() {
        const newQuestion = structuredClone(question);
        newQuestion.answers = [
            ...newQuestion.answers,
            {
                id: nanoid(),
                content: `{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Câu trả lời mới","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}`,
            },
        ];
        setQuestion(newQuestion);
    }

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 py-10"
            onClick={() => setIsOpen(false)}
        >
            <div
                className={clsx('my-4 max-h-full w-[700px] overflow-y-auto rounded-md border bg-white p-4', {
                    'pointer-events-none opacity-50': loading,
                })}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex space-x-3 pb-3">
                    <button
                        className="rounded bg-primary py-1 px-5 text-white hover:bg-primary-dark"
                        onClick={() => handleCreateQuestion()}
                    >
                        Tạo câu hỏi
                    </button>
                    <button
                        className="rounded bg-red-500 py-1 px-5 text-white hover:bg-red-600"
                        onClick={() => setIsOpen(false)}
                    >
                        Đóng
                    </button>
                </div>
                <div className="">
                    <FullEditor content={question.content} onEditorChange={handleContentQuestionChange} />

                    {question.hint ? (
                        <details>
                            <summary className="mt-2 font-semibold">
                                <span className="mr-3">Gợi ý:</span>
                                <button
                                    className="my-2 rounded border px-3 py-0.5 font-semibold text-red-500 hover:border-red-500"
                                    onClick={handleDeleteHint}
                                >
                                    Xoá gợi ý
                                </button>
                            </summary>
                            <FullEditor
                                content={question.hint}
                                onEditorChange={handleHintChange}
                                placeholder="Nhập gợi ý ..."
                            />
                        </details>
                    ) : (
                        <div className="my-2">
                            <button
                                className="my-2 rounded border px-3 py-0.5 font-semibold text-primary hover:border-primary"
                                onClick={handleAddHint}
                            >
                                Thêm gợi ý
                            </button>
                        </div>
                    )}

                    {question.explanation ? (
                        <details>
                            <summary className="mt-2 font-semibold">
                                <span className="mr-3">Giải thích:</span>
                                <button
                                    className="my-2 rounded border px-3 py-0.5 font-semibold text-red-500 hover:border-red-500"
                                    onClick={handleDeleteExplanation}
                                >
                                    Xoá giải thích
                                </button>
                            </summary>
                            <FullEditor
                                content={question.explanation}
                                onEditorChange={handleExplanationChange}
                                placeholder="Nhập giải thích ..."
                            />
                        </details>
                    ) : (
                        <div className="my-2">
                            <button
                                className="rounded border px-3 py-0.5 font-semibold text-primary hover:border-primary"
                                onClick={handleAddExplanation}
                            >
                                Thêm giải thích
                            </button>
                        </div>
                    )}
                    <div className="mt-2 font-semibold">Câu trả lời</div>
                    <div>
                        {question.answers.map((answer, index) => (
                            <Answer
                                key={answer.id}
                                content={answer.content}
                                isCorrectAnswer={answer.id === question.correctAnswer}
                                onEditorChange={(editorState) => handleAnswerChange(index, editorState)}
                                onDelete={() => handleAnswerDelete(index)}
                                onCorrectAnswerChange={() => handleCorrectAnswerChange(answer.id)}
                            />
                        ))}
                        <button
                            className="w-full rounded border py-2 px-5 font-medium text-primary hover:border-gray-700"
                            onClick={handleAddAnswer}
                        >
                            Thêm câu trả lời
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
