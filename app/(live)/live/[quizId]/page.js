import { db } from '~/configs/firebase';
import { collection, doc, getDoc } from 'firebase/firestore';
import Page from '../components/Page';

//rwwsVRSBtu3Zayaib2mX

async function getData(quizId) {
    const quizRef = doc(db, 'quizzes', quizId);
    const docSnap = await getDoc(quizRef);

    if (docSnap.exists) {
        return docSnap.data();
    }
}

export default async function Live({ params }) {
    const quiz = await getData(params.quizId);

    return <Page quizRaw={quiz} />;
}
