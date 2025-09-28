// firebase.ts
import { Platform } from "react-native";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithRedirect,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getReactNativePersistence } from "firebase/auth";

const provider = new GoogleAuthProvider();

const firebaseConfig = {
  apiKey: "AIzaSyCAh6DlzEVFqQ0DZsa3x1rXdDpTxIZxODQ",
  authDomain: "beacon-1f322.firebaseapp.com",
  databaseURL: "https://beacon-1f322-default-rtdb.firebaseio.com",
  projectId: "beacon-1f322",
  storageBucket: "beacon-1f322.firebasestorage.app",
  messagingSenderId: "1090790005743",
  appId: "1:1090790005743:web:d94ea9bbffcf3f8452b41a",
  measurementId: "G-PJDB5C8R91",
};

export const app = initializeApp(firebaseConfig);

export const auth =
  Platform.OS === "web"
    ? getAuth(app)
    : initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });

export const db = getFirestore(app);
export const rtdb = getDatabase(app);

export async function getAnalyticsIfWeb() {
  if (Platform.OS === "web") {
    const { getAnalytics } = await import("firebase/analytics");
    return getAnalytics(app);
  }
  return null;
}

export async function signInWithGoogleWeb() {
  if (Platform.OS !== "web") throw new Error("Web only");
  const { getAuth, GoogleAuthProvider, signInWithPopup } = await import(
    "firebase/auth"
  );
  const webAuth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(webAuth, provider);
  return result.user;
}

export async function signInWithGoogleNative(
  idToken?: string,
  accessToken?: string
) {
  const credential = GoogleAuthProvider.credential(idToken, accessToken);
  const userCred = await signInWithCredential(auth, credential);
  return userCred.user;
}
