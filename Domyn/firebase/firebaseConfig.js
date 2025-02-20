// firebase / firebaseConfig.js

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAdobl2-mkKCbXM72rfK2JlIVwJI--PaS0",
  authDomain: "doymnfirebase.firebaseapp.com",
  projectId: "doymnfirebase",
  storageBucket: "doymnfirebase.firebasestorage.app",
  messagingSenderId: "549054823029",
  appId: "1:549054823029:web:f40e956d19600a0e32563c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
