'use client';

import { db } from '~/configs/firebase';
import { collection, doc, getDoc, getDocs, onSnapshot } from 'firebase/firestore';
import QuestionCard from './components/QuestionCard';
import AddQuestionButton from './components/AddQuestionButton/AddQuestionButton';
import { useEffect, useState } from 'react';

export default function EditQuiz() {
    const [quiz, setQuiz] = useState({});
    const [questions, setQuestions] = useState([]);
    useEffect(() => {
        const quizRef = doc(db, 'quizzes', '2N1o0E3jxeH3v8trhYPj');
        const unsubscribeQuiz = onSnapshot(quizRef, (snapshot) => {
            setQuiz({ id: snapshot.id, ...snapshot.data() });
        });

        const questionsRef = collection(quizRef, 'questions');
        const unsubscribeQuestions = onSnapshot(questionsRef, (snapshot) => {
            const questionsDocSnaps = snapshot.docs;

            const questions = questionsDocSnaps.map((docSnap) => {
                return { id: docSnap.id, ...docSnap.data() };
            });
            setQuestions(questions);
        });

        return () => {
            unsubscribeQuiz();
            unsubscribeQuestions();
        };
    }, []);

    return (
        <div className="mx-auto w-[700px] py-10">
            <h1>{quiz.name}</h1>
            {questions?.map((question) => (
                <QuestionCard question={question} quizId={quiz.id} key={question.id} />
            ))}
            <AddQuestionButton />
        </div>
    );
}
