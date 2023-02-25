// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyC6_CT3bOzzp94tTTaEGtrIi3HxDkkjJW0',
  authDomain: 'gata-quiz.firebaseapp.com',
  projectId: 'gata-quiz',
  storageBucket: 'gata-quiz.appspot.com',
  messagingSenderId: '1030308143497',
  appId: '1:1030308143497:web:01c018842711a09052c158',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
