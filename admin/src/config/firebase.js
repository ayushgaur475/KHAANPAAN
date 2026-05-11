import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAm-RvWThyWK-LemqmJsAeygqQRrUzy_xk",
  authDomain: "khaanpaan-7c6fb.firebaseapp.com",
  projectId: "khaanpaan-7c6fb",
  storageBucket: "khaanpaan-7c6fb.firebasestorage.app",
  messagingSenderId: "653401228026",
  appId: "1:653401228026:web:49ce33d8b4752fee9f3f43",
  measurementId: "G-TVMZT0VDBC"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging, getToken };
