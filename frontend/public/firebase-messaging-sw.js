// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAm-RvWThyWK-LemqmJsAeygqQRrUzy_xk",
  authDomain: "khaanpaan-7c6fb.firebaseapp.com",
  projectId: "khaanpaan-7c6fb",
  storageBucket: "khaanpaan-7c6fb.firebasestorage.app",
  messagingSenderId: "653401228026",
  appId: "1:653401228026:web:49ce33d8b4752fee9f3f43",
  measurementId: "G-TVMZT0VDBC"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title || "KhaanPaan";
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png',
    image: payload.notification.image || '/header_img.png',
    badge: '/favicon.png', // Try favicon for a smaller, simpler badge
    tag: 'khaanpaan-notification',
    renotify: true,
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
