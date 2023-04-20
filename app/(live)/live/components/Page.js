'use client';

import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useDebounce } from 'use-debounce';
import QUIZ_STATE from '~/constants/quiz-state';
import { quizSelector } from '~/redux/selectors';
import { quizActions } from '~/redux/slices/quizSlice';
import Header from './Header';
import Question from './Question';
import Sidebar from './Sidebar';
import MobileSidebar from './MobileSidebar';
import Modal from '~/app/components/Modal';

// ANIM FOR RESULT
const animGroup = {
    hidden: { opacity: 1 },
    show: {
        opacity: 1,
        transition: {
            delayChildren: 0.2,
            staggerChildren: 0.15,
        },
    },
};

const animItem = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0 },
};

export default function Page({ quizRaw }) {
    const quiz = useSelector(quizSelector);
    const dispatch = useDispatch();
    const [questionIndex] = useDebounce(quiz?.currentQuestion, 200);
    const [showSidebar, setShowSidebar] = useState(true);
    const [showMobileSidebar, setShowMobileSidebar] = useState(false);
    const [showComfirmComplete, setShowComfirmComplete] = useState(false);

    const showCompletedQuiz = () => toast.success('Bạn đã hoàn thành tất cả câu hỏi!');
    const isQuizComplete = useMemo(() => quiz?.state !== QUIZ_STATE.PENDDING, [quiz?.state]);

    useEffect(() => {
        dispatch(quizActions.setQuiz(quizRaw));
    }, []);

    useEffect(() => {
        if (isQuizComplete && quiz?.skippedQuestion === 0) {
            showCompletedQuiz();
        }
    }, [isQuizComplete]);
    function handleToggleResultAndReview() {
        dispatch(quizActions.toggleResultAndReview());
    }
    function handleReset() {
        dispatch(quizActions.reset());
    }

    return quiz ? (
        <>
            <div className="w-full overflow-x-hidden">
                <Header setShowMobileSidebar={setShowMobileSidebar} setShowComfirmComplete={setShowComfirmComplete} />
                {/* MOBILE SIZEBAR */}
                <AnimatePresence>
                    {showMobileSidebar && (
                        <>
                            <motion.div
                                className="fixed inset-0 z-50 bg-black/50"
                                onClick={() => setShowMobileSidebar(false)}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            />
                            <MobileSidebar
                                setShowMobileSidebar={setShowMobileSidebar}
                                setShowComfirmComplete={setShowComfirmComplete}
                            />
                        </>
                    )}
                </AnimatePresence>
                {quiz.state !== QUIZ_STATE.RESULT ? (
                    <AnimatePresence mode="wait">
                        <motion.main exit={{ opacity: 0 }} className="flex h-screen pt-14">
                            {/* Main quiz */}
                            <div className="h-full flex-1 bg-gray-100 px-4 pb-6" style={{ overflowY: 'overlay' }}>
                                <Question questionIndex={questionIndex || 0} />
                            </div>

                            {/* SIZEBAR */}
                            <div
                                className={clsx('relative transition-all duration-300 md:hidden', {
                                    'w-0': !showSidebar,
                                    'w-[352px]': showSidebar,
                                })}
                            >
                                <button
                                    className={clsx(
                                        'absolute -left-9 flex h-14 w-9 items-center justify-center rounded-l-lg border-l border-t border-b border-primary bg-white text-gray-700 hover:text-primary',
                                        {
                                            '!border-none': showSidebar,
                                        }
                                    )}
                                    onClick={() => setShowSidebar(!showSidebar)}
                                >
                                    <motion.div
                                        whileHover={{ x: showSidebar ? 4 : -4 }}
                                        className="flex h-full w-full items-center justify-center"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className={clsx('h-6 w-6', {
                                                'rotate-180': showSidebar,
                                            })}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
                                            />
                                        </svg>
                                    </motion.div>
                                </button>
                                {showSidebar && <Sidebar />}
                            </div>
                        </motion.main>
                    </AnimatePresence>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.main
                            exit={{ opacity: 0 }}
                            className="flex min-h-screen flex-col items-center bg-gray-100 px-4 pt-14"
                        >
                            <motion.h2
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-8 text-2xl font-bold text-gray-700"
                            >
                                TỔNG KẾT
                            </motion.h2>
                            <motion.div
                                variants={animGroup}
                                initial="hidden"
                                animate="show"
                                className="mt-16 grid grid-cols-4 gap-5 md:mt-10 md:w-full md:grid-cols-1"
                            >
                                <motion.div
                                    variants={animItem}
                                    className="relative flex h-[200px] w-[200px] flex-col items-center justify-center rounded-xl bg-white pt-5 text-green-500 md:h-[130px] md:w-full md:flex-row md:justify-start md:px-16 md:pt-0 sm:px-10 xs:px-5"
                                >
                                    <div className="absolute top-0 -translate-y-1/2 md:relative md:translate-y-0">
                                        <CircularProgressbarWithChildren
                                            className="h-20"
                                            background
                                            styles={buildStyles({
                                                backgroundColor: '#fff',
                                                pathColor: 'currentcolor',
                                                trailColor: '#eee',
                                            })}
                                            strokeWidth={5}
                                            value={((quiz.correctQuestion * 100) / quiz.numberOfQuestion).toFixed(0)}
                                        >
                                            <div className="text-lg">
                                                {((quiz.correctQuestion * 100) / quiz.numberOfQuestion).toFixed(0) +
                                                    '%'}
                                            </div>
                                        </CircularProgressbarWithChildren>
                                    </div>
                                    <div className="flex flex-col items-center md:flex-1">
                                        <div className="font-semibold uppercase text-gray-600">Số câu đúng</div>
                                        <div className="text-7xl font-bold">{quiz.correctQuestion}</div>
                                    </div>
                                </motion.div>
                                <motion.div
                                    variants={animItem}
                                    className="relative flex h-[200px] w-[200px] flex-col items-center justify-center rounded-xl bg-white pt-5 text-red-500 md:h-[130px] md:w-full md:flex-row md:justify-start md:px-16 md:pt-0 sm:px-10 xs:px-5"
                                >
                                    <div className="absolute top-0 -translate-y-1/2 md:relative md:translate-y-0">
                                        <CircularProgressbarWithChildren
                                            className="h-20"
                                            background
                                            styles={buildStyles({
                                                backgroundColor: '#fff',
                                                pathColor: 'currentcolor',
                                                trailColor: '#eee',
                                            })}
                                            strokeWidth={5}
                                            value={((quiz.incorrectQuestion * 100) / quiz.numberOfQuestion).toFixed(0)}
                                        >
                                            <div className="text-lg">
                                                {((quiz.incorrectQuestion * 100) / quiz.numberOfQuestion).toFixed(0) +
                                                    '%'}
                                            </div>
                                        </CircularProgressbarWithChildren>
                                    </div>
                                    <div className="flex flex-col items-center md:flex-1">
                                        <div className="font-semibold uppercase text-gray-600">Số câu sai</div>
                                        <div className="text-7xl font-bold">{quiz.incorrectQuestion}</div>
                                    </div>
                                </motion.div>
                                <motion.div
                                    variants={animItem}
                                    className="relative flex h-[200px] w-[200px] flex-col items-center justify-center rounded-xl bg-white pt-5 text-orange-400 md:h-[130px] md:w-full md:flex-row md:justify-start md:px-16 md:pt-0 sm:px-10 xs:px-5"
                                >
                                    <div className="absolute top-0 -translate-y-1/2 md:relative md:translate-y-0">
                                        <CircularProgressbarWithChildren
                                            className="h-20"
                                            background
                                            styles={buildStyles({
                                                backgroundColor: '#fff',
                                                pathColor: 'currentcolor',
                                                trailColor: '#eee',
                                            })}
                                            strokeWidth={5}
                                            value={((quiz.skippedQuestion * 100) / quiz.numberOfQuestion).toFixed(0)}
                                        >
                                            <div className="text-lg">
                                                {((quiz.skippedQuestion * 100) / quiz.numberOfQuestion).toFixed(0) +
                                                    '%'}
                                            </div>
                                        </CircularProgressbarWithChildren>
                                    </div>
                                    <div className="flex flex-col items-center md:flex-1">
                                        <div className="font-semibold uppercase text-gray-600">Số câu bỏ qua</div>
                                        <div className="text-7xl font-bold">{quiz.skippedQuestion}</div>
                                    </div>
                                </motion.div>
                                <motion.div
                                    variants={animItem}
                                    className="relative flex h-[200px] w-[200px] flex-col items-center justify-center rounded-xl bg-white pt-5 text-primary md:h-[130px] md:w-full md:flex-row md:justify-start md:px-16 md:pt-0 sm:px-10 xs:px-5"
                                >
                                    <div className="absolute top-0 -translate-y-1/2 md:relative md:translate-y-0">
                                        <CircularProgressbarWithChildren
                                            className="h-20"
                                            background
                                            styles={buildStyles({
                                                backgroundColor: '#fff',
                                                pathColor: 'currentcolor',
                                                trailColor: '#eee',
                                            })}
                                            strokeWidth={5}
                                            value={100}
                                        >
                                            <div className="text-lg">{100 + '%'}</div>
                                        </CircularProgressbarWithChildren>
                                    </div>
                                    <div className="flex flex-col items-center md:flex-1">
                                        <div className="font-semibold uppercase text-gray-600">Tổng số câu</div>
                                        <div className="text-7xl font-bold">{quiz.numberOfQuestion}</div>
                                    </div>
                                </motion.div>
                            </motion.div>

                            {/* Moblie button */}
                            <motion.div className="my-5 hidden w-full justify-center space-x-3 md:flex sm:block sm:space-x-0 sm:space-y-3">
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className={clsx(
                                        'flex h-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium uppercase text-white hover:bg-primary-dark sm:w-full'
                                    )}
                                    onClick={handleToggleResultAndReview}
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
                                            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>

                                    <p className="ml-1">Xem lại bài làm</p>
                                </motion.button>
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className={clsx(
                                        'flex h-10 flex-shrink-0 items-center justify-center rounded-lg border border-primary px-4 text-sm font-medium uppercase text-primary hover:bg-primary/5 sm:w-full'
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
                            </motion.div>
                        </motion.main>
                    </AnimatePresence>
                )}
            </div>
            <Modal
                warning
                title="Xác nhận kết thúc!"
                description="Bạn chưa hoàn thành hết tất cả câu hỏi. Bạn có muốn kết thúc không?"
                okButtonText="Kết thúc"
                cancelButtonText="Huỷ"
                open={showComfirmComplete}
                setOpen={setShowComfirmComplete}
                onOkButtonClick={() => {
                    dispatch(quizActions.complete());
                    setShowMobileSidebar(false);
                }}
            />
        </>
    ) : (
        <div></div>
    );
}
