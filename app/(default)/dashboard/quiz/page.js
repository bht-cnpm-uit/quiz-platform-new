'use client';
import clsx from 'clsx';
import { addDoc, collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { db } from '~/configs/firebase';

function CreateQuizModal({ isOpen, setIsOpen }) {
    const [name, setName] = useState('Bài trắc nghiệm mới');
    const [loading, setLoading] = useState(false);
    const createSuccessNotify = () => toast.success('Tạo bài trắc nghiệm thành công!');
    const errorNotify = () => toast.error('Có lỗi xảy ra!');

    async function handleCreateQuiz() {
        try {
            const quizzesCollectionRef = collection(db, 'quizzes');
            setLoading(true);
            const newQuizDocRef = await addDoc(quizzesCollectionRef, { name });
            setLoading(false);
            if (newQuizDocRef) {
                createSuccessNotify();
                setIsOpen(false);
            } else {
                errorNotify();
            }
        } catch (err) {
            errorNotify();
            setLoading(false);
        }
    }
    return (
        isOpen && (
            <div
                className={clsx('fixed inset-0 z-[1000] flex items-center justify-center bg-black/50', {
                    'pointer-events-none opacity-60': loading,
                })}
                onClick={() => setIsOpen(false)}
            >
                <div
                    className="flex w-[500px] flex-col items-center space-y-3 rounded-lg bg-white p-3"
                    onClick={(e) => e.stopPropagation()}
                >
                    <p className="text-xl font-semibold">Tên bài trắc nghiệm</p>
                    <input
                        type="text"
                        className="w-full rounded border px-3 py-2 focus:border-gray-700"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <button
                        className="w-full rounded bg-primary py-2 font-semibold text-white hover:bg-primary-dark"
                        onClick={handleCreateQuiz}
                    >
                        Tạo
                    </button>
                    <button
                        className="w-full rounded bg-red-400 py-2 font-semibold text-white hover:bg-red-500"
                        onClick={() => setIsOpen(false)}
                    >
                        Huỷ
                    </button>
                </div>
            </div>
        )
    );
}

function QuizCard({ quiz }) {
    const [loading, setLoading] = useState(false);
    const deleteSuccessNotify = () => toast.success('Xoá bài trắc nghiệm thành công!');
    const errorNotify = () => toast.error('Có lỗi xảy ra!');

    function deleteQuiz(quizId) {
        if (!confirm('Bạn có chắc chắn xoá bài trắc nghiệm? Không thể khôi phục!')) {
            return;
        }
        const quizDocRef = doc(db, 'quizzes', quizId);
        setLoading(true);
        deleteDoc(quizDocRef)
            .then(() => {
                deleteSuccessNotify();
            })
            .catch((error) => {
                errorNotify();
                setLoading(false);
                console.log(error);
            });
    }
    return (
        <div
            className={clsx('flex', {
                'pointer-events-none opacity-60': loading,
            })}
        >
            <Link
                href={'/dashboard/quiz/' + quiz.id}
                key={quiz.id}
                className="block flex-1 cursor-pointer rounded bg-white py-3 px-4 shadow ring-primary hover:ring-1"
            >
                {quiz.name}
            </Link>
            <button
                className="ml-2 rounded bg-red-500 px-2 py-2 text-white hover:bg-red-600"
                onClick={() => deleteQuiz(quiz.id)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path
                        fillRule="evenodd"
                        d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>
        </div>
    );
}

export default function QuizList() {
    const [quizzes, setQuizzes] = useState([]);
    const [isOpenModal, setIsOpenModal] = useState(false);
    useEffect(() => {
        const quizzesRef = collection(db, 'quizzes');
        const unsubscribeQuizzes = onSnapshot(quizzesRef, (snapshot) => {
            const quizzesDocSnaps = snapshot.docs;

            const quizzes = quizzesDocSnaps.map((docSnap) => {
                return { id: docSnap.id, ...docSnap.data() };
            });
            setQuizzes(quizzes);
        });

        return () => {
            unsubscribeQuizzes();
        };
    }, []);

    return (
        <div className="mx-auto max-w-[900px] pt-5">
            <button
                className="w-full rounded-xl border border-primary p-3 font-bold text-primary hover:border-primary-dark"
                onClick={() => setIsOpenModal(true)}
            >
                Tạo bài trắc nghiệm mới
            </button>
            <div className="mt-5 space-y-4">
                {quizzes.map((quiz) => (
                    <QuizCard quiz={quiz} key={quiz.id} />
                ))}
            </div>
            <CreateQuizModal isOpen={isOpenModal} setIsOpen={setIsOpenModal} />
        </div>
    );
}
