// lib/firebase.js
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
  getDocs,
  setDoc,
  Timestamp,
  orderBy,
  serverTimestamp,
  limit
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize App Check only on client side with proper error handling
let appCheck = null;

if (typeof window !== 'undefined') {
  // Use dynamic import with proper error handling
  import('firebase/app-check')
    .then((appCheckModule) => {
      const { initializeAppCheck, ReCaptchaV3Provider } = appCheckModule;
      
      // Make sure the site key is available
      if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
        appCheck = initializeAppCheck(app, {
          provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY),
          isTokenAutoRefreshEnabled: false, // Set to false to avoid issues
        });
        console.log('App Check initialized successfully');
      } else {
        console.warn('Recaptcha site key not found, App Check disabled');
      }
    })
    .catch((error) => {
      console.warn('App Check initialization failed, continuing without it:', error);
    });
}

// Export Firebase Auth functions
export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
};

// Export Firestore functions
export {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  getDocs,
  getDoc,
  setDoc,
  orderBy,
  serverTimestamp,
  limit,
  Timestamp,
};