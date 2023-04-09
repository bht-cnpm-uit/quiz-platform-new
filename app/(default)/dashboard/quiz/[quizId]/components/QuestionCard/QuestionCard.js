'use client';
import { useState } from 'react';
import { db } from '~/configs/firebase';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import FullEditor from '~/app/components/Editor/FullEditor';
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

    // Hint handler
    function handleHintChange(editorState) {
        const newQuestion = structuredClone(questionEditing);
        newQuestion.hint = JSON.stringify(editorState.toJSON());
        setQuestionEditing(newQuestion);
    }

    function handleAddHint() {
        const newQuestion = structuredClone(questionEditing);
        newQuestion.hint = `{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Phần gợi ý ...","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}`;
        setQuestionEditing(newQuestion);
    }

    function handleDeleteHint() {
        const newQuestion = structuredClone(questionEditing);
        delete newQuestion.hint;
        setQuestionEditing(newQuestion);
        console.log(newQuestion);
    }

    // Explaination handler
    function handleExplainationChange(editorState) {
        const newQuestion = structuredClone(questionEditing);
        newQuestion.explaination = JSON.stringify(editorState.toJSON());
        setQuestionEditing(newQuestion);
    }

    function handleAddExplaination() {
        const newQuestion = structuredClone(questionEditing);
        newQuestion.explaination = `{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Phần giải thích ...","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}`;
        setQuestionEditing(newQuestion);
    }

    function handleDeleteExplaination() {
        const newQuestion = structuredClone(questionEditing);
        delete newQuestion.explaination;
        setQuestionEditing(newQuestion);
        console.log(newQuestion);
    }

    // Answer handler
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
                <FullEditor
                    content={question.content}
                    onEditorChange={handleContentQuestionChange}
                    placeholder="Nhập câu hỏi ..."
                />
            ) : (
                <ReadOnlyEditor content={question.content} />
            )}

            {editing ? (
                questionEditing.hint ? (
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
                )
            ) : (
                questionEditing.hint && (
                    <details>
                        <summary className="mt-2 font-semibold">Gợi ý:</summary>
                        <ReadOnlyEditor content={question.hint} />
                    </details>
                )
            )}

            {editing ? (
                questionEditing.explaination ? (
                    <details>
                        <summary className="mt-2 font-semibold">
                            <span className="mr-3">Giải thích:</span>
                            <button
                                className="my-2 rounded border px-3 py-0.5 font-semibold text-red-500 hover:border-red-500"
                                onClick={handleDeleteExplaination}
                            >
                                Xoá giải thích
                            </button>
                        </summary>
                        <FullEditor
                            content={question.explaination}
                            onEditorChange={handleExplainationChange}
                            placeholder="Nhập giải thích ..."
                        />
                    </details>
                ) : (
                    <div className="my-2">
                        <button
                            className="rounded border px-3 py-0.5 font-semibold text-primary hover:border-primary"
                            onClick={handleAddExplaination}
                        >
                            Thêm giải thích
                        </button>
                    </div>
                )
            ) : (
                questionEditing.explaination && (
                    <details>
                        <summary className="mt-2 font-semibold">Giải thích:</summary>
                        <ReadOnlyEditor content={question.explaination} />
                    </details>
                )
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
