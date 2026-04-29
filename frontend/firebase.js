// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// REPLACE with your own Firebase project configuration
const firebaseConfig = {
  apiKey: "REPLACE_ME",
  authDomain: "khaanpaan.firebaseapp.com",
  projectId: "khaanpaan",
  storageBucket: "khaanpaan.appspot.com",
  messagingSenderId: "REPLACE_ME",
  appId: "REPLACE_ME"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);