import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
    PUBLIC_FIREBASE_API_KEY,
    PUBLIC_FIREBASE_APP_ID,
    PUBLIC_FIREBASE_AUTH_DOMAIN,
    PUBLIC_FIREBASE_MEASUREMENT_ID,
    PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    PUBLIC_FIREBASE_PROJECT_ID,
    PUBLIC_FIREBASE_STORAGE_BUCKET,
} from "$env/static/public";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
    apiKey: PUBLIC_FIREBASE_API_KEY,
    authDomain: PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: PUBLIC_FIREBASE_APP_ID,
    measurementId: PUBLIC_FIREBASE_MEASUREMENT_ID,
    region: "europe-west1",
};

const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const functions = getFunctions(app, "europe-west1");
export const auth = getAuth(app);

if (app && firestore && auth) {
    console.log("Firebase Initialized");
} else {
    console.log("Firebase Initialization Failed");
}
