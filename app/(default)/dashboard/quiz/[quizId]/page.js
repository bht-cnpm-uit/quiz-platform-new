import { db } from '~/configs/firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import QuestionCard from './components/QuestionCard';
import AddQuestionButton from './components/AddQuestionButton/AddQuestionButton';

async function getData(quizId) {
    try {
        const quizRef = doc(db, 'quizzes', quizId);
        const quizDocSnap = await getDoc(quizRef);

        if (!quizDocSnap.exists) {
            throw new Error('Quiz not exists');
        }
        const questionsRef = collection(quizRef, 'questions');
        const questionsSnap = await getDocs(questionsRef);
        const questionsDocSnaps = questionsSnap.docs;

        const questions = questionsDocSnaps.map((docSnap) => {
            return { id: docSnap.id, ...docSnap.data() };
        });

        return { id: quizDocSnap.id, ...quizDocSnap.data(), questions };
    } catch (err) {
        console.log(err);
    }
}

export default async function EditQuiz() {
    const quiz = await getData('2N1o0E3jxeH3v8trhYPj');

    return (
        <div className="mx-auto w-[700px]">
            <h1>{quiz.name}</h1>
            {quiz.questions.map((question) => (
                <QuestionCard question={question} quizId={quiz.id} key={question.id} />
            ))}
            <AddQuestionButton />
        </div>
    );
}
