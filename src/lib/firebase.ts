import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const env = import.meta.env;

const storageBucket = env.VITE_FIREBASE_STORAGE_BUCKET as string;
const storageBucketUrl = storageBucket.startsWith("gs://")
  ? storageBucket
  : `gs://${storageBucket}`;

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY as string,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN as string,
  databaseURL: env.VITE_FIREBASE_DATABASE_URL as string,
  projectId: env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: env.VITE_FIREBASE_APP_ID as string,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const database = getDatabase(app);
export const storage = getStorage(app, storageBucketUrl);
