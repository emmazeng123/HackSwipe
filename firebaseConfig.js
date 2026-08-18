import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBRfV38XMEKYcV9R3NoOEaDnNMF_jbSCDg",
  authDomain: "hackswipe-47144.firebaseapp.com",
  projectId: "hackswipe-47144",
  storageBucket: "hackswipe-47144.firebasestorage.app",
  messagingSenderId: "176384764263",
  appId: "1:176384764263:web:c86369d1edb038796527c2",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
