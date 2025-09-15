// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, doc, setDoc, updateDoc, arrayUnion, arrayRemove, query, orderBy, onSnapshot } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAjvNKWXy2J2WLX67Y66XYuYWI31V0svyk",
  authDomain: "aircrewreview.firebaseapp.com",
  projectId: "aircrewreview",
  storageBucket: "aircrewreview.firebasestorage.app",
  messagingSenderId: "1068927908148",
  appId: "1:1068927908148:web:abd07b75cbe4ce8f3c0d61",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export {
  auth,
  db,
  provider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  query,
  orderBy,
  onSnapshot
};