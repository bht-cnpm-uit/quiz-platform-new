'use client';
import { useState } from 'react';
import { db } from '~/configs/firebase';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import QuestionEditor from '~/app/components/Editor/QuestionEditor';
import ReadOnlyEditor from '~/app/components/Editor/ReadOnlyEditor';
import AnswerCard from './AnswerCard';
import clsx from 'clsx';
import { nanoid } from 'nanoid';
import { toast } from 'react-toastify';

export default function QuestionCard({ quizId, question, editingInDefault = false }) {
    const updateSuccessNotify = () => toast.success('Cập nhật câu hỏi thành công!');
    const deleteSuccessNotify = () => toast.success('Xoá câu hỏi thành công!');
    const errorNotify = () => toast.error('Có lỗi xảy ra!');
    const [editing, setEditing] = useState(editingInDefault);
    const [loading, setLoading] = useState(false);
    const [questionEditing, setQuestionEditing] = useState(question);

    function handleUpdateQuestion() {
        const questionDocRef = doc(db, 'quizzes', quizId, 'questions', question.id);
        setLoading(true);
        updateDoc(questionDocRef, questionEditing)
            .then(() => {
                updateSuccessNotify();
            })
            .catch((error) => {
                errorNotify();
                console.log(error);
            })
            .finally(() => {
                setEditing(false);
                setLoading(false);
            });
    }

    function handleDeleteQuestion() {
        if (!confirm('Bạn có chắc chắn xoá câu hỏi? Không thể khôi phục!')) {
            return;
        }
        const questionDocRef = doc(db, 'quizzes', quizId, 'questions', question.id);
        setLoading(true);
        deleteDoc(questionDocRef)
            .then(() => {
                deleteSuccessNotify();
            })
            .catch((error) => {
                errorNotify();
                setLoading(false);
                console.log(error);
            });
    }

    function handleContentQuestionChange(editorState) {
        const newQuestion = structuredClone(questionEditing);
        newQuestion.content = JSON.stringify(editorState.toJSON());
        setQuestionEditing(newQuestion);
    }

    function handleCancelQuestionChange() {
        setQuestionEditing(question);
        setEditing(false);
    }

    function handleAnswerChange(index, editorState) {
        const newQuestion = structuredClone(questionEditing);
        if (newQuestion.answers[index] !== undefined) {
            newQuestion.answers[index].content = JSON.stringify(editorState.toJSON());
        }
        setQuestionEditing(newQuestion);
    }

    function handleAnswerDelete(index) {
        const newQuestion = structuredClone(questionEditing);
        newQuestion.answers.splice(index, 1);
        setQuestionEditing(newQuestion);
    }

    function handleCorrectAnswerChange(id) {
        const newQuestion = structuredClone(questionEditing);
        newQuestion.correctAnswer = id;
        setQuestionEditing(newQuestion);
    }

    function handleAddAnswer() {
        const newQuestion = structuredClone(questionEditing);
        newQuestion.answers = [
            ...newQuestion.answers,
            {
                id: nanoid(),
                content: `{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Câu trả lời mới","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}`,
            },
        ];
        setQuestionEditing(newQuestion);
    }

    return (
        <div
            className={clsx('my-4 rounded-md border bg-white p-4', {
                'border-primary': editing,
                'pointer-events-none opacity-50': loading,
            })}
        >
            <div className="mb-3 flex space-x-2 border-b pb-3">
                {!editing && (
                    <>
                        <button
                            className="rounded bg-primary py-1 px-5 text-white hover:bg-primary-dark"
                            onClick={() => setEditing(!editing)}
                        >
                            Sửa
                        </button>
                        <button
                            className="rounded bg-red-500 py-1 px-5 text-white hover:bg-red-600"
                            onClick={() => handleDeleteQuestion()}
                        >
                            Xoá
                        </button>
                    </>
                )}
                {editing && (
                    <>
                        <button
                            className="rounded bg-primary py-1 px-5 text-white hover:bg-primary-dark"
                            onClick={handleUpdateQuestion}
                        >
                            Cập nhật
                        </button>
                        <button
                            className="rounded bg-orange-500 py-1 px-5 text-white hover:bg-orange-600"
                            onClick={handleCancelQuestionChange}
                        >
                            Huỷ
                        </button>
                    </>
                )}
            </div>
            {editing ? (
                <QuestionEditor content={question.content} onEditorChange={handleContentQuestionChange} />
            ) : (
                <ReadOnlyEditor content={question.content} />
            )}

            <div className="mt-2 font-semibold">Câu trả lời</div>
            <div>
                {questionEditing.answers.map((answer, index) => (
                    <AnswerCard
                        key={answer.id}
                        content={answer.content}
                        isCorrectAnswer={answer.id === questionEditing.correctAnswer}
                        editing={editing}
                        onEditorChange={(editorState) => handleAnswerChange(index, editorState)}
                        onDelete={() => handleAnswerDelete(index)}
                        onCorrectAnswerChange={() => handleCorrectAnswerChange(answer.id)}
                    />
                ))}
                {editing && (
                    <button
                        className="w-full rounded border py-2 px-5 font-medium text-primary hover:border-gray-700"
                        onClick={handleAddAnswer}
                    >
                        Thêm câu trả lời
                    </button>
                )}
            </div>
        </div>
    );
}
