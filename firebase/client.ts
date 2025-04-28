
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDXCKYuMa-f7xeG3cQ7_p9wa3XKRhpY5P8",
  authDomain: "prepifyai-d3838.firebaseapp.com",
  projectId: "prepifyai-d3838",
  storageBucket: "prepifyai-d3838.firebasestorage.app",
  messagingSenderId: "983591794066",
  appId: "1:983591794066:web:6050bb902d78cd9c51bd4b",
  measurementId: "G-1CG3B1KBM1"
};

// Initialize Firebase
const app = ! getApps.length ? initializeApp(firebaseConfig) : getApp();


export const auth = getAuth(app);
export const db = getFirestore(app);