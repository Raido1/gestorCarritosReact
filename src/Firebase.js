import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCm9OXLkPC4_g8tDJStEsBqX_kLQwjtHUw",
  authDomain: "gestorcarritos.firebaseapp.com",
  projectId: "gestorcarritos",
  storageBucket: "gestorcarritos.firebasestorage.app",
  messagingSenderId: "384182245568",
  appId: "1:384182245568:web:043dde726331619b487525",
  measurementId: "G-LEQDFT2D7B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export const signInWithGoogle = () => {
    signInWithPopup(auth, provider).then((result) => {
        console.log(result);
    }).catch((error) => {
        console.log(error);
    })
}
export const db = getFirestore(app);