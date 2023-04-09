'use client';

import { useState } from 'react';
import Answer from './Answer';
import placeholderQuestion from '~/data/placeholderQuestion';
import { toast } from 'react-toastify';
import { db } from '~/configs/firebase';
import clsx from 'clsx';
import QuestionEditor from '~/app/components/Editor/QuestionEditor';
import { nanoid } from 'nanoid';
import { addDoc, collection } from 'firebase/firestore';

export default function Modal({ setIsOpen }) {
    const [question, setQuestion] = useState(structuredClone(placeholderQuestion));
    const [loading, setLoading] = useState(false);
    const createSuccessNotify = () => toast.success('Tạo câu hỏi thành công!');
    const errorNotify = () => toast.error('Có lỗi xảy ra!');

    async function handleCreateQuestion() {
        const questionsCollectionRef = collection(db, 'quizzes', '2N1o0E3jxeH3v8trhYPj', 'questions');
        setLoading(true);
        const newQuestionDocRef = await addDoc(questionsCollectionRef, placeholderQuestion);
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
                    <QuestionEditor content={question.content} onEditorChange={handleContentQuestionChange} />

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
