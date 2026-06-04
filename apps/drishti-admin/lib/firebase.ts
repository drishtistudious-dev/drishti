import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCNFpkQJvBfoQbS64kkDonaFvO9V0OwbzM",
  authDomain: "drishti-ea8bb.firebaseapp.com",
  projectId: "drishti-ea8bb",
  storageBucket: "drishti-ea8bb.firebasestorage.app",
  messagingSenderId: "499412924120",
  appId: "1:499412924120:web:d7527978c3c3cdd1b2c9ad",
  measurementId: "G-R5NGKQ9CTM"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
