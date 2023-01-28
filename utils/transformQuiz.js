import QUESTION_STATE from '../constants/question-state';
import QUIZ_STATE from '../constants/quiz-state';

export default function transformQuiz(quizRaw) {
    return {
        ...quizRaw,
        currentQuestion: 0,
        numberOfQuestion: quizRaw.questions.length,
        correctQuestion: 0,
        incorrectQuestion: 0,
        skippedQuestion: 0,
        state: QUIZ_STATE.PENDDING,
        questions: quizRaw.questions.map((ques) => ({
            ...ques,
            showExplanation: false,
            showHint: false,
            chosenAnswer: null,
            state: QUESTION_STATE.PENDDING,
        })),
    };
}
