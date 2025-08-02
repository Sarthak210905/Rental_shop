
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  "projectId": "garbaglam",
  "appId": "1:466471929178:web:6b11e7257841acf559df63",
  "storageBucket": "garbaglam.firebasestorage.app",
  "apiKey": "AIzaSyBaR_baUdayvDoxvjXVD_4yU9bFMQXV7jw",
  "authDomain": "garbaglam.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "466471929178"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, storage, googleProvider };
