'use client';

import { db } from '~/configs/firebase';
import { collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import QuestionCard from './components/QuestionCard';
import AddQuestionButton from './components/AddQuestionButton/AddQuestionButton';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

function NameQuizEditor({ name, quizId }) {
    const [editing, setEditing] = useState(false);
    const [nameInput, setNameInput] = useState(name);
    useEffect(() => {
        setNameInput(name);
    }, [name]);
    const [loading, setLoading] = useState(false);
    const updateSuccessNotify = () => toast.success('Cập nhật tên câu hỏi thành công!');
    const errorNotify = () => toast.error('Có lỗi xảy ra!');
    function handleSubmit() {
        const questionDocRef = doc(db, 'quizzes', quizId);
        setLoading(true);
        updateDoc(questionDocRef, { name: nameInput })
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
        setEditing(false);
    }
    return editing ? (
        <div className="flex w-[500px] items-center">
            <input
                type="text"
                className="flex-1 rounded border py-2 px-4"
                value={nameInput ?? ''}
                onChange={(e) => setNameInput(e.target.value)}
            />
            <button className="ml-2 rounded border p-2 hover:text-gray-500" onClick={handleSubmit}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
            </button>
            <button className="ml-2 rounded border p-2 hover:text-gray-500" onClick={() => setEditing(false)}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    ) : (
        <div className="flex items-center">
            <div className="text-lg font-bold">{name}</div>
            <button className="ml-2 hover:text-gray-500" onClick={() => setEditing(true)}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                </svg>
            </button>
        </div>
    );
}

export default function EditQuiz({ params }) {
    const [quiz, setQuiz] = useState({});
    const [questions, setQuestions] = useState([]);
    useEffect(() => {
        const quizRef = doc(db, 'quizzes', params.quizId);
        const unsubscribeQuiz = onSnapshot(quizRef, (snapshot) => {
            setQuiz({ id: snapshot.id, ...snapshot.data() });
        });

        const questionsQuery = query(collection(quizRef, 'questions'), orderBy('index'));
        const unsubscribeQuestions = onSnapshot(questionsQuery, (snapshot) => {
            const questionsDocSnaps = snapshot.docs;

            const questions = questionsDocSnaps.map((docSnap) => {
                return { id: docSnap.id, ...docSnap.data() };
            });
            setQuestions(questions);
        });

        return () => {
            unsubscribeQuiz();
            unsubscribeQuestions();
        };
    }, []);

    return (
        <div className="mx-auto w-[700px] py-10">
            <div className="fixed top-0 right-0 left-w-sidebar z-[100] flex h-16 items-center justify-between bg-white px-4">
                <NameQuizEditor name={quiz.name} quizId={quiz.id} />
                <AddQuestionButton
                    quizId={quiz.id}
                    className="rounded bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-dark"
                    questions={questions}
                />
            </div>
            <div className="mt-16">
                {questions.length === 0 && (
                    <div className="my-10 text-center text-xl font-semibold">Chưa có câu hỏi nào!</div>
                )}
                {questions?.map((question, index) => (
                    <div className="relative" key={question.id}>
                        <QuestionCard question={question} quizId={quiz.id} questions={questions} />
                        <div className="absolute top-0 -left-9 flex h-8 w-9 items-center justify-center rounded border bg-white text-lg font-semibold">
                            {index + 1}
                        </div>
                    </div>
                ))}
            </div>

            <AddQuestionButton
                quizId={quiz.id}
                className="w-full rounded border py-2 px-5 font-medium text-primary hover:border-gray-700"
                questions={questions}
            />
        </div>
    );
}
