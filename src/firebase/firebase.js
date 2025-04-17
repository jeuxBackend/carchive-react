import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
    apiKey: "AIzaSyDCNd4pecsQQGTIFg-sRh-PynJtkr4Up6w",
    authDomain: "carchieve-6e28c.firebaseapp.com",
    projectId: "carchieve-6e28c",
    storageBucket: "carchieve-6e28c.firebasestorage.app",
    messagingSenderId: "776781154984",
    appId: "1:776781154984:web:f4af9ef9d1d557125d509d",
    measurementId: "G-XV2BEER44V"
  };

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };