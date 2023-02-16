import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: process.env.FirebaseKey,
  authDomain: "streamhub-137dc.firebaseapp.com",
  projectId: "streamhub-137dc",
  storageBucket: "streamhub-137dc.appspot.com",
  messagingSenderId: "793176563284",
  appId: "1:793176563284:web:682c12a74df039150e97c1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();
export default app;
