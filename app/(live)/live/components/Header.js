'use client';

import { motion } from 'framer-motion';
import clsx from 'clsx';
import { useState } from 'react';
import { buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '~/components/Modal';
import QUESTION_STATE from '~/constants/question-state';
import QUIZ_STATE from '~/constants/quiz-state';
import { quizSelector } from '~/redux/selectors';
import { quizActions } from '~/redux/slices/quizSlice';

export default function Header() {
    const quiz = useSelector(quizSelector);
    const dispatch = useDispatch();
    const [showComfirmComplete, setShowComfirmComplete] = useState(false);

    function handleNextQuestion() {
        dispatch(quizActions.nextQuestion());
    }
    function handlePrevQuestion() {
        dispatch(quizActions.prevQuestion());
    }
    function handleCompleteQuiz() {
        const penddingQuestion = quiz.questions.reduce(
            (total, currQuestion) => (currQuestion.state === QUESTION_STATE.PENDDING ? total + 1 : total),
            0
        );
        if (penddingQuestion > 0) {
            setShowComfirmComplete(true);
        } else {
            dispatch(quizActions.complete());
        }
    }
    function handleToggleResultAndReview() {
        dispatch(quizActions.toggleResultAndReview());
    }
    function handleReset() {
        dispatch(quizActions.reset());
    }

    return (
        <>
            <div className="fixed right-0 left-0 z-[10] flex h-14 items-center justify-between border-b bg-gray-100 px-8">
                <div className="flex items-center">
                    <div className="mr-3 text-lg font-medium">{quiz.name}</div>
                    <div className="text-primary">
                        <CircularProgressbarWithChildren
                            className="h-8 w-8"
                            background
                            styles={buildStyles({
                                backgroundColor: '#eee',
                                pathColor: 'currentcolor',
                                trailColor: 'transparent',
                            })}
                            value={(
                                ((quiz.correctQuestion + quiz.incorrectQuestion) * 100) /
                                quiz.numberOfQuestion
                            ).toFixed(0)}
                        >
                            <div style={{ fontSize: '10px' }} className="font-medium text-gray-700">
                                {(
                                    ((quiz.correctQuestion + quiz.incorrectQuestion) * 100) /
                                    quiz.numberOfQuestion
                                ).toFixed(0) + '%'}
                            </div>
                        </CircularProgressbarWithChildren>
                    </div>
                    {quiz.state === QUIZ_STATE.PENDDING ? (
                        <button
                            className={clsx(
                                'ml-3 flex h-9 items-center rounded-lg border bg-white px-4 text-sm font-medium uppercase text-primary hover:border-primary'
                            )}
                            onClick={handleCompleteQuiz}
                        >
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
                                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>

                            <p className="ml-1">Kết thúc</p>
                        </button>
                    ) : (
                        <>
                            <motion.button
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={clsx(
                                    'ml-3 flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium uppercase text-white hover:bg-primary-dark'
                                )}
                                onClick={handleToggleResultAndReview}
                            >
                                {quiz.state === QUIZ_STATE.RESULT ? (
                                    <>
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
                                                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>

                                        <p className="ml-1">Xem lại bài làm</p>
                                    </>
                                ) : (
                                    <>
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
                                                d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                                            />
                                        </svg>

                                        <p className="ml-1">Xem tổng kết</p>
                                    </>
                                )}
                            </motion.button>
                            <motion.button
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={clsx(
                                    'ml-3 flex h-9 items-center rounded-lg border border-primary px-4 text-sm font-medium uppercase text-primary hover:bg-primary/5'
                                )}
                                onClick={handleReset}
                            >
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
                                        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                                    />
                                </svg>

                                <p className="ml-1">Làm lại</p>
                            </motion.button>
                        </>
                    )}
                </div>
                <div className="flex space-x-3">
                    {quiz.state !== QUIZ_STATE.RESULT && (
                        <>
                            <motion.button
                                initial={{ scale: 0.5 }}
                                animate={{ scale: 1 }}
                                whileTap={{ scale: 0.9 }}
                                className={clsx(
                                    'flex h-9 select-none items-center rounded-lg border border-primary px-4 text-sm font-medium uppercase text-primary hover:bg-primary/5',
                                    {
                                        'pointer-events-none !opacity-50': quiz.currentQuestion === 0,
                                    }
                                )}
                                onClick={handlePrevQuestion}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="h-5 w-5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.75 19.5L8.25 12l7.5-7.5"
                                    />
                                </svg>
                                <p className="ml-1">Câu hỏi trước</p>
                            </motion.button>

                            <motion.button
                                initial={{ scale: 0.5 }}
                                animate={{ scale: 1 }}
                                whileTap={{ scale: 0.9 }}
                                className={clsx(
                                    'flex h-9 select-none items-center rounded-lg bg-primary px-4 text-sm font-medium uppercase text-white hover:bg-primary-dark',
                                    {
                                        'pointer-events-none !opacity-50':
                                            quiz.currentQuestion === quiz.questions.length - 1,
                                    }
                                )}
                                onClick={handleNextQuestion}
                            >
                                <p className="mr-1">Câu hỏi sau</p>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="h-5 w-5"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </motion.button>
                        </>
                    )}
                </div>
            </div>
            <Modal
                warning
                title="Xác nhận kết thúc!"
                description="Bạn chưa hoàn thành hết tất cả câu hỏi. Bạn có muốn kết thúc không?"
                okButtonText="Kết thúc"
                cancelButtonText="Huỷ"
                open={showComfirmComplete}
                setOpen={setShowComfirmComplete}
                onOkButtonClick={() => dispatch(quizActions.complete())}
            />
        </>
    );
}
