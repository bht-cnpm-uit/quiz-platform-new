'use client';

import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { quizActions } from '~/redux/slices/quizSlice';
import SingleChoice from './SingleChoice';

const animGroup = {
    hidden: { opacity: 1 },
    show: {
        opacity: 1,
        transition: {
            delayChildren: 0.2,
            staggerChildren: 0.1,
        },
    },
};
export default function SingleChoiceGroup({ answers, correctAnswer, chosenAnswer, questionIndex, submited }) {
    const dispatch = useDispatch();
    function handleChoose(answeriId) {
        dispatch(
            quizActions.chooseAnswer({
                questionIndex,
                chosenAnswer: answeriId,
            })
        );
    }

    return (
        <motion.div
            key={questionIndex}
            className="mt-10 space-y-3"
            variants={animGroup}
            initial="hidden"
            animate="show"
        >
            {answers?.map((answer, index) => (
                <SingleChoice
                    key={index + questionIndex * 10}
                    chosen={chosenAnswer === answer.id}
                    incorrect={submited && chosenAnswer === answer.id && chosenAnswer !== correctAnswer}
                    answer={submited && correctAnswer === answer.id}
                    disabled={submited}
                    onClick={() => handleChoose(answer.id)}
                >
                    {answer.content}
                </SingleChoice>
            ))}
        </motion.div>
    );
}
