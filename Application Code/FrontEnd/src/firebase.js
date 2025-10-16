import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA725eAOnhVt5bOHbnH3pYTRae5DGWhoDU",
  authDomain: "fypapi-d6762.firebaseapp.com",
  projectId: "fypapi-d6762",
  storageBucket: "fypapi-d6762.appspot.com",
  messagingSenderId: "634001757394",
  appId: "1:634001757394:web:a095bd875dcd3c4dd3890b",
  measurementId: "G-8CB69Z9K10",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
