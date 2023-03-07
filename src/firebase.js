// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

//Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAx_1ZG2J5WWgc5OUtdqwWmWt8w78kZoNU',
  authDomain: 'web3-quest-journey.firebaseapp.com',
  projectId: 'web3-quest-journey',
  storageBucket: 'web3-quest-journey.appspot.com',
  messagingSenderId: '213342267048',
  appId: '1:213342267048:web:d1ac5a80d69d4b4adc849d',
  measurementId: 'G-CMGC112PPR',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
