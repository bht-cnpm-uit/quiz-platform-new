import { createSlice } from '@reduxjs/toolkit';
import QUESTION_STATE from '~/constants/question-state';
import QUIZ_STATE from '~/constants/quiz-state';
import QUIZ from '~/data/quiz';
import transformQuiz from '~/utils/transformQuiz';

const initialState = transformQuiz(QUIZ);

export const quizSlice = createSlice({
    name: 'quiz',
    initialState,
    reducers: {
        chooseAnswer: (state, action) => {
            /**
             * {
             *      questionIndex: Number
             *      chosenAnswer: Number
             * }
             */
            state.questions[action.payload.questionIndex].chosenAnswer = action.payload.chosenAnswer;
        },

        submitQuestion: (state, action) => {
            // payload --> questionIndex
            const question = state.questions[action.payload];
            question.showExplanation = true;
            if (question.chosenAnswer !== question.correctAnswer) {
                state.incorrectQuestion++;
                question.state = QUESTION_STATE.INCORRECT;
            } else {
                state.correctQuestion++;
                question.state = QUESTION_STATE.CORRECT;
            }

            // Check complete
            const penddingQuestion = state.questions.reduce(
                (total, currQuestion) => (currQuestion.state === QUESTION_STATE.PENDDING ? total + 1 : total),
                0
            );
            if (penddingQuestion <= 0) {
                state.state = QUIZ_STATE.REVIEW;
            }
        },

        toggleShowExplation: (state, action) => {
            // payload --> questionIndex
            const question = state.questions[action.payload];
            question.showExplanation = !question.showExplanation;
        },
        toggleShowHint: (state, action) => {
            // payload --> questionIndex
            const question = state.questions[action.payload];
            question.showHint = !question.showHint;
        },

        nextQuestion: (state, action) => {
            if (state.currentQuestion < state.questions.length - 1) {
                state.currentQuestion++;
            }
        },
        prevQuestion: (state, action) => {
            if (state.currentQuestion > 0) {
                state.currentQuestion--;
            }
        },
        gotoQuestion: (state, action) => {
            if (action.payload < state.questions.length && action.payload >= 0) {
                state.currentQuestion = action.payload;
            }
        },

        complete: (state, action) => {
            state.state = QUIZ_STATE.RESULT;
            state.questions.forEach((ques) => {
                if (ques.state !== QUESTION_STATE.PENDDING) {
                    return;
                }
                if (ques.chosenAnswer === null || ques.chosenAnswer === undefined) {
                    state.skippedQuestion++;
                    ques.state = QUESTION_STATE.SKIPPED;
                } else if (ques.chosenAnswer !== ques.correctAnswer) {
                    state.incorrectQuestion++;
                    ques.state = QUESTION_STATE.INCORRECT;
                } else {
                    state.correctQuestion++;
                    ques.state = QUESTION_STATE.CORRECT;
                }
            });
        },

        toggleResultAndReview: (state, action) => {
            if (state.state !== QUIZ_STATE.PENDDING) {
                state.state = state.state === QUIZ_STATE.RESULT ? QUIZ_STATE.REVIEW : QUIZ_STATE.RESULT;
            }
        },

        reset: (state, action) => {
            return initialState;
        },
    },
});

// Action creators are generated for each case reducer function
const quizReducer = quizSlice.reducer;
const quizActions = quizSlice.actions;

export default quizReducer;
export { quizActions };
