// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  addDoc,
  getDoc,
  query,
  where,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import {
  getAuth,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  // onAuthStateChanged
} from 'firebase/auth';

//Firebase configuration
const firebaseProdConfig = {
  apiKey: 'AIzaSyAx_1ZG2J5WWgc5OUtdqwWmWt8w78kZoNU',
  authDomain: 'web3-quest-journey.firebaseapp.com',
  projectId: 'web3-quest-journey',
  storageBucket: 'web3-quest-journey.appspot.com',
  messagingSenderId: '213342267048',
  appId: '1:213342267048:web:d1ac5a80d69d4b4adc849d',
  measurementId: 'G-CMGC112PPR',
};

const firebaseDevConfig = {
  apiKey: 'AIzaSyB2COw9wQzW-qwst6NG7ashaktVcVMt5yk',
  authDomain: 'gata-protocol-quiz.firebaseapp.com',
  projectId: 'gata-protocol-quiz',
  storageBucket: 'gata-protocol-quiz.appspot.com',
  messagingSenderId: '772515033498',
  appId: '1:772515033498:web:fc790f4ca750384fa94a23',
};

const firebaseConfig = import.meta.env.PROD ? firebaseProdConfig : firebaseDevConfig;

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
  if (user) {
    return user;
  } else {
    return null;
  }
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

const getUserId = async (email) => {
  var user = {};
  const q = query(collection(db, 'users'), where('email', '==', email));
  const snapshot = await getDocs(q);
  snapshot.forEach((doc) => {
    user.userId = doc.id;
    user.userData = doc.data();
  });
  
  return user;
};

const addDocumentWithID = async (collectionName, docID, data) => {
  await setDoc(doc(db, collectionName, docID), data);
};

const addNewDocument = async (collectionName, data) => {
  const docData = await addDoc(collection(db, collectionName), data);
  return docData.id;
};

const addProgress = async (email, progressData) => {
  const user = await getUserId(email);
  var id = user.userId;
  const userRef = doc(db, 'users', id);
  await updateDoc(userRef, {
    progress: progressData.moduleNumber,
  });
  await setDoc(doc(db, 'progress', email), progressData);
};

const getProgress = async (email) => {
  const docRef = doc(db, 'progress', email);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const progress = docSnap.data();
    const moduleNumber = progress.moduleNumber;
    return moduleNumber;
  } else {
    const moduleNumber = 0;
    return moduleNumber;
  }
};

export {
  db,
  getCurrentUser,
  logout,
  register,
  login,
  addNewDocument,
  addDocumentWithID,
  auth,
  addProgress,
  getProgress,
  getUserId,
};
