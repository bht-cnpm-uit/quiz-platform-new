// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyChLnWnglK0yyeUqd3Z1k4DLsVl0690FCo',
    authDomain: 'quiz-b4bb9.firebaseapp.com',
    projectId: 'quiz-b4bb9',
    storageBucket: 'quiz-b4bb9.appspot.com',
    messagingSenderId: '738779623879',
    appId: '1:738779623879:web:58c502eeb9473382b229e2',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
