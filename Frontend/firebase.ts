// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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