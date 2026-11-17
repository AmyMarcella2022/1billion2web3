import {
  collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc,
  query, where, onSnapshot, serverTimestamp,
} from 'firebase/firestore';
import { onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
import { db, auth } from '../firebase';

export { onAuthStateChanged, serverTimestamp, onSnapshot, collection, doc, query, where };
export { db, auth };

export const norm = (email) => (email || '').trim().toLowerCase();

/* ---------- admins ---------- */
export const checkIsAdmin = async (email) => {
  if (!email) return false;
  try {
    const snap = await getDoc(doc(db, 'admins', norm(email)));
    return snap.exists();
  } catch (e) {
    return false;
  }
};
export const addAdmin = (email, addedBy) =>
  setDoc(doc(db, 'admins', norm(email)), { email: norm(email), addedBy, addedAt: serverTimestamp() });
export const removeAdmin = (email) => deleteDoc(doc(db, 'admins', norm(email)));

/* ---------- users ---------- */
export const findUserDoc = async (email) => {
  const q = query(collection(db, 'users'), where('email', '==', norm(email)));
  const snap = await getDocs(q);
  let found = null;
  snap.forEach((d) => {
    if (!found) found = { id: d.id, ...d.data() };
  });
  return found;
};
export const touchUser = (id, data) => updateDoc(doc(db, 'users', id), data);

export const setUserProgress = async (userDocId, email, moduleNumber) => {
  const n = Math.max(0, Math.min(9, parseInt(moduleNumber, 10) || 0));
  await setDoc(doc(db, 'users', userDocId), { progress: n }, { merge: true });
  await setDoc(doc(db, 'progress', norm(email)), { email: norm(email), moduleNumber: n }, { merge: true });
  return n;
};
export const deleteUserRecords = async (userDocId, email) => {
  await deleteDoc(doc(db, 'users', userDocId));
  try {
    await deleteDoc(doc(db, 'progress', norm(email)));
  } catch (e) {
    /* progress doc may not exist */
  }
};
export const sendReset = (email) => sendPasswordResetEmail(auth, norm(email));

/* ---------- support requests ---------- */
export const createSupportRequest = (data) =>
  addDoc(collection(db, 'supportRequests'), {
    ...data,
    email: norm(data.email),
    status: 'open',
    adminReply: '',
    seenByUser: true,
    createdAt: serverTimestamp(),
  });
export const updateSupportRequest = (id, data) => updateDoc(doc(db, 'supportRequests', id), data);
export const deleteSupportRequest = (id) => deleteDoc(doc(db, 'supportRequests', id));
export const getUnseenReplies = async (email) => {
  const q = query(
    collection(db, 'supportRequests'),
    where('email', '==', norm(email)),
    where('seenByUser', '==', false)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

/* ---------- feedback ---------- */
export const hasFeedback = async (email) => (await getDoc(doc(db, 'feedback', norm(email)))).exists();
export const submitFeedback = (email, name, rating, comment) =>
  setDoc(doc(db, 'feedback', norm(email)), {
    email: norm(email),
    name: name || '',
    rating,
    comment: (comment || '').trim(),
    createdAt: serverTimestamp(),
  });

/* ---------- chatbot FAQ (admin-managed answers) ---------- */
export const loadCustomFaqs = async () => {
  try {
    const snap = await getDocs(collection(db, 'botFaqs'));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (e) {
    return [];
  }
};
export const addFaq = (data) => addDoc(collection(db, 'botFaqs'), { ...data, createdAt: serverTimestamp() });
export const deleteFaq = (id) => deleteDoc(doc(db, 'botFaqs', id));

export const tsToDate = (ts) => (ts && ts.toDate ? ts.toDate() : null);
export const fmtDate = (ts) => {
  const d = tsToDate(ts);
  return d ? d.toLocaleString() : '—';
};

/* ---------- AI knowledge + settings (admin-managed) ---------- */
export const saveKnowledge = (id, data) =>
  id
    ? updateDoc(doc(db, 'botKnowledge', id), { ...data, updatedAt: serverTimestamp() })
    : addDoc(collection(db, 'botKnowledge'), { ...data, updatedAt: serverTimestamp() });
export const deleteKnowledge = (id) => deleteDoc(doc(db, 'botKnowledge', id));
export const saveBotSettings = (data) => setDoc(doc(db, 'botSettings', 'main'), data, { merge: true });
