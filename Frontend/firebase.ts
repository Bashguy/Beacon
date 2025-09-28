import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const provider = new GoogleAuthProvider();

signInWithPopup(auth, provider)
  .then((result) => {
    console.log("User signed in:", result.user);
  })
  .catch((error) => {
    console.error(error);
  });

const firebaseConfig = {
  apiKey: "AIzaSyASHBhLRzE8StJh7R-iDBKXPxbtZqIS1Gg",
  authDomain: "beacon-1f322.firebaseapp.com",
  databaseURL: "https://beacon-1f322-default-rtdb.firebaseio.com",
  projectId: "beacon-1f322",
  storageBucket: "beacon-1f322.firebasestorage.app",
  messagingSenderId: "1090790005743",
  appId: "1:1090790005743:web:d94ea9bbffcf3f8452b41a",
  measurementId: "G-PJDB5C8R91"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const rtdb = getDatabase(app);