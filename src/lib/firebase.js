// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAVM7uQvBpy1o5elzZmzqLI1kFR1DTbWow",
  authDomain: "pahnawabanaras-4727c.firebaseapp.com",
  projectId: "pahnawabanaras-4727c",
  storageBucket: "pahnawabanaras-4727c.firebasestorage.app",
  messagingSenderId: "140514436168",
  appId: "1:140514436168:web:c7983c359b05ae85a2247d",
  measurementId: "G-5MXEBD967B"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
