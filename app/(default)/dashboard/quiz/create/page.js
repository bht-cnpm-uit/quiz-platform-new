'use client';
import { collection, addDoc } from 'firebase/firestore';
import { useState } from 'react';
import { db } from '~/configs/firebase';
import QUIZ from '~/data/quiz';
import ContentEditor from '../components/ContentEditor';
import QuestionCard from '../components/QuestionCard';

export default function CreateQuiz() {
    const [quiz, setQuiz] = useState(QUIZ);

    function handleCreateQuiz() {
        const quizzesRef = collection(db, 'quizzes');
        addDoc(quizzesRef, quiz)
            .then((quizSnap) => console.log(quizSnap))
            .catch((err) => console.log(err));
    }

    function setQuestion(index, question) {
        const questions = [...quiz.questions];
        questions[index] = question;
        setQuiz({
            ...quiz,
            questions: [...questions],
        });
    }

    function handleAddQuestion() {
        setQuiz({
            ...quiz,
            questions: [
                ...quiz.questions,
                {
                    type: 'single-choose',
                    content: `Câu hỏi ${quiz.questions.length + 1}`,
                    answers: ['Câu trả lời 1', 'Câu trả lời 2'],
                    correctAnswer: 0,
                },
            ],
        });
    }

    function handleDeleteQuestion(index) {
        const questions = quiz.questions.filter((question, i) => i !== index);
        setQuiz({ ...quiz, questions });
    }

    return (
        <div className="flex w-full max-w-5xl space-x-4">
            <div className="flex-1 shadow-test">
                <div>
                    {quiz.questions.map((question, index) => (
                        <div key={index} className="flex">
                            <QuestionCard
                                question={question}
                                onQuestionChange={(question) => setQuestion(index, question)}
                            />
                            <button onClick={() => handleDeleteQuestion(index)}>Xoa</button>
                        </div>
                    ))}
                </div>
                <button onClick={handleAddQuestion}>Tạo câu hỏi</button>
            </div>
            <div className="w-60 shadow-test">
                <ContentEditor />
                <button onClick={handleCreateQuiz}>Tao QUIZ</button>
            </div>
        </div>
    );
}
