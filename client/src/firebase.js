// src/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCfc2Oo9m58PxVOe5TbFj1E7ivHeP839iA",
  authDomain: "focusforge-30f5e.firebaseapp.com",
  projectId: "focusforge-30f5e",
  storageBucket: "focusforge-30f5e.firebasestorage.app",
  messagingSenderId: "328683372814",
  appId: "1:328683372814:web:8410bc904b01e0769c575f",
  measurementId: "G-L5J4JLXY87"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export {
  signInWithPopup,
  signOut,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
};
