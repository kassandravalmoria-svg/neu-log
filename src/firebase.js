// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyC0FSOVGPYcYccdEE1lSHIVWGFihFkX61Q",
  authDomain: "neulibrarylog-9b85a.firebaseapp.com",
  projectId: "neulibrarylog-9b85a",
  storageBucket: "neulibrarylog-9b85a.firebasestorage.app",
  messagingSenderId: "647283097076",
  appId: "1:647283097076:web:478019d1dc205f48e00da1",
};


const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);

