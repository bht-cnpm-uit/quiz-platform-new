// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

/* Đừng đụng vào cái này
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};*/

// Dưới đây là 2 cái config firebase, chuyển qua chuyển lại nếu cái web nó ngủm


const firebaseConfig = {
    apiKey: 'AIzaSyC-Rjy4zZWCSDoS491z-eNMATIIUzEFhbc',
    authDomain: 'quiz-2580c.firebaseapp.com',
    projectId: 'quiz-2580c',
    storageBucket: 'qquiz-2580c.appspot.com',
    messagingSenderId: '960047624019',
    appId: '1:960047624019:web:c6b9c6e645023eac5f7ba6',
};

/*
const firebaseConfig = {
    apiKey: 'AIzaSyChLnWnglK0yyeUqd3Z1k4DLsVl0690FCo',
    authDomain: 'quiz-b4bb9.firebaseapp.com',
    projectId: 'quiz-b4bb9',
    storageBucket: 'quiz-b4bb9.appspot.com',
    messagingSenderId: '738779623879',
    appId: '1:738779623879:web:58c502eeb9473382b229e2',
};
*/

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
