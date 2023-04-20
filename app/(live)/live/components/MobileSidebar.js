'use client';

import clsx from 'clsx';
import { motion } from 'framer-motion';
import { buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import { useDispatch, useSelector } from 'react-redux';
import { quizSelector } from '~/redux/selectors';
import { quizActions } from '~/redux/slices/quizSlice';
import QUESTION_STATE from '~/constants/question-state';
import QUIZ_STATE from '~/constants/quiz-state';

const animGroup = {
    hidden: { opacity: 1 },
    show: {
        opacity: 1,
        transition: {
            delayChildren: 0.2,
            staggerChildren: 0.07,
        },
    },
};

const animItem = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

export default function MobileSidebar({ setShowMobileSidebar, setShowComfirmComplete }) {
    const quiz = useSelector(quizSelector);
    const questions = quiz.questions;
    const dispatch = useDispatch();

    function handleGotoQuestion(index) {
        dispatch(quizActions.gotoQuestion(index));
        setShowMobileSidebar(false);
    }
    function handleToggleResultAndReview() {
        setShowMobileSidebar(false);
        dispatch(quizActions.toggleResultAndReview());
    }
    function handleReset() {
        setShowMobileSidebar(false);
        dispatch(quizActions.reset());
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
    return (
        <motion.div
            className="fixed top-0 bottom-0 right-0 z-[100] flex h-full w-[352px] flex-col bg-white xs:w-screen"
            initial={{ x: 600 }}
            animate={{ x: 0 }}
            exit={{ x: 600 }}
            transition={{ duration: 0.3 }}
        >
            <button
                className="flex h-h-header w-full items-center justify-center bg-gray-100"
                onClick={() => setShowMobileSidebar(false)}
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
                        d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
                    />
                </svg>
            </button>
            {/* LIST */}
            <div className="flex flex-1 justify-center overflow-y-auto px-4 pb-4 pt-6">
                <motion.div
                    variants={animGroup}
                    initial="hidden"
                    animate="show"
                    className="grid h-fit grid-cols-5 gap-3"
                >
                    {questions.map((question, index) => (
                        <motion.button
                            variants={animItem}
                            whileTap={{ scale: 0.9 }}
                            key={index}
                            className={clsx(
                                'flex h-11 w-11 items-center justify-center rounded-lg border bg-gray-50 font-semibold text-gray-700 ring-offset-1 hover:ring-2 hover:ring-primary',
                                {
                                    'border-none !bg-red-400 !text-white': question.state === QUESTION_STATE.INCORRECT,
                                    'border-none !bg-green-400 !text-white': question.state === QUESTION_STATE.CORRECT,
                                    'border-none !bg-orange-300 !text-white': question.state === QUESTION_STATE.SKIPPED,
                                    'ring-2 ring-primary': index === quiz.currentQuestion,
                                }
                            )}
                            onClick={() => handleGotoQuestion(index)}
                        >
                            {index + 1}
                        </motion.button>
                    ))}
                </motion.div>
            </div>

            <div className="space-y-3 px-3 pb-3">
                {quiz.state === QUIZ_STATE.PENDDING ? (
                    <button
                        className={clsx(
                            'flex h-10 w-full items-center justify-center rounded-lg border bg-white px-4 text-sm font-medium uppercase text-primary hover:border-primary'
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
                                'flex h-10 w-full items-center justify-center rounded-lg border border-primary px-4 text-sm font-medium uppercase text-primary hover:bg-primary/5'
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
                        <motion.button
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={clsx(
                                'flex h-10 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium uppercase text-white hover:bg-primary-dark'
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
                    </>
                )}
            </div>
        </motion.div>
    );
}
