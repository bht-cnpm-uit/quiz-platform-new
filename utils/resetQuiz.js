import QUESTION_STATE from '../constants/question-state';
import QUIZ_STATE from '../constants/quiz-state';

export default function resetQuiz(quiz) {
    return {
        ...quiz,
        currentQuestion: 0,
        numberOfQuestion: quiz?.questions?.length,
        correctQuestion: 0,
        incorrectQuestion: 0,
        skippedQuestion: 0,
        state: QUIZ_STATE.PENDDING,
        questions: quiz?.questions?.map((ques) => ({
            ...ques,
            showExplanation: false,
            showHint: false,
            chosenAnswer: null,
            state: QUESTION_STATE.PENDDING,
        })),
    };
}
