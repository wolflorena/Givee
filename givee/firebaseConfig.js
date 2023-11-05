import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBh4e7r-F87Yy5bbWVmG_jRJfL8dPabl2I",
  authDomain: "givee-e172f.firebaseapp.com",
  projectId: "givee-e172f",
  storageBucket: "givee-e172f.appspot.com",
  messagingSenderId: "542455215546",
  appId: "1:542455215546:web:446d94843da46af97dd983",
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
