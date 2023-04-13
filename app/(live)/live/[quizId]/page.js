import { db } from '~/configs/firebase';
import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore';
import Page from '../components/Page';

async function getData(quizId) {
    try {
        const quizRef = doc(db, 'quizzes', quizId);
        const quizDocSnap = await getDoc(quizRef);

        if (!quizDocSnap.exists) {
            throw new Error('Quiz not exists');
        }
        const questionsQuery = query(collection(quizRef, 'questions'), orderBy('index'));
        const questionsSnap = await getDocs(questionsQuery);
        const questionsDocSnaps = questionsSnap.docs;

        const questions = questionsDocSnaps.map((docSnap) => {
            return { id: docSnap.id, ...docSnap.data() };
        });

        return { id: quizDocSnap.id, ...quizDocSnap.data(), questions };
    } catch (err) {
        console.log(err);
    }
}

export default async function Live({ params }) {
    const quiz = await getData(params.quizId);

    return <Page quizRaw={quiz} />;
}
