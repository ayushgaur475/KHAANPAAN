import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAm-RvWThyWK-LemqmJsAeygqQRrUzy_xk",
  authDomain: "khaanpaan-7c6fb.firebaseapp.com",
  projectId: "khaanpaan-7c6fb",
  storageBucket: "khaanpaan-7c6fb.firebasestorage.app",
  messagingSenderId: "653401228026",
  appId: "1:653401228026:web:49ce33d8b4752fee9f3f43",
  measurementId: "G-TVMZT0VDBC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, RecaptchaVerifier };
