// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, addDoc } from 'firebase/firestore';
import {
  getAuth,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

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
const db = getFirestore(app);
const auth = getAuth(app);

const getCurrentUser = () => {
  const user = auth.currentUser;
  // var name = user.displayName
  // var phone = user.phoneNumber
  // var photo = user.photoURL
  // var email = user.email
  return user;
};

const register = (email, password) => {
  // Create a new user with email and pass
  return new Promise(async (resolve, reject) => {
    const userDetails = await createUserWithEmailAndPassword(auth, email, password);
    const user = userDetails.user;
    console.log(user);
    if (user) {
      resolve(user);
    } else {
      reject('Error creating user');
    }
  });
};

const login = (email, password) => {
  return new Promise(async (resolve, reject) => {
    const userDetails = await signInWithEmailAndPassword(auth, email, password);
    const user = userDetails.user;

    if (user) {
      resolve(user);
    } else {
      reject('Error logging in');
    }
  });
};

const logout = () => {
  return new Promise(async function (resolve, reject) {
    signOut(auth);

    if (getCurrentUser()) {
      reject('Error logging out');
    } else {
      resolve();
    }
  });
};

const addDocumentWithID = async (collectionName, docID, data) => {
  await setDoc(doc(db, collectionName, docID), data);
};

const addNewDocument = async (collectionName, data) => {
  const docData = await addDoc(collection(db, collectionName), data);
  return docData.id;
};

export { db, getCurrentUser, logout, register, login, addNewDocument, addDocumentWithID, auth };
