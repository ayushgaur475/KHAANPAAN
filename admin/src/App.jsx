import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Routes, Route } from 'react-router-dom'
import Orders from './pages/Orders/Orders'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Dashboard from './pages/Dashboard/Dashboard'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login/Login'
import Profile from './pages/Profile/Profile'
import Customers from './pages/Customers/Customers'
import { useState, useEffect } from 'react'
import { messaging, getToken, onMessage } from './config/firebase'
import axios from 'axios'

const notificationSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2861/2861-preview.mp3');

function App() {
  const url = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://127.0.0.1:5001"
    : "https://khaanpaan-backend.onrender.com";
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [adminPhoto, setAdminPhoto] = useState('');

  const requestAdminNotificationPermission = async (adminToken) => {
    console.log("Checking notification permission...");
    try {
      const permission = await Notification.requestPermission();
      console.log("Permission status:", permission);
      if (permission === 'granted') {
        console.log("Registering Service Worker...");
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        console.log("Service Worker registered successfully.");

        console.log("Attempting to get FCM Token...");
        const fcmToken = await getToken(messaging, {
          vapidKey: "BB-3hzSp7qof1IbETD-yTRzLaNvwS_3U5HEfJINPZa5yihG5gpCyBP7_uV92JQjaqvvhtgVm11pDbd7gynFPeko",
          serviceWorkerRegistration: registration
        });

        if (fcmToken) {
          console.log("✅ Admin FCM Token:", fcmToken);
          await axios.post(url + "/api/user/update-fcm-token", { fcmToken }, { headers: { token: adminToken } });
          console.log("✅ Token sent to backend successfully.");
        } else {
          console.warn("⚠️ No FCM Token received. Check Firebase config.");
        }
      } else {
        console.warn("❌ Permission not granted. Notifications disabled.");
      }
    } catch (error) {
      console.error("🔥 Error in notification setup:", error);
    }
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      requestAdminNotificationPermission(token);

      // Listen for foreground messages and play sound
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log('Message received. ', payload);
        notificationSound.play().catch(e => console.log("Sound play error:", e));
        // You can also show a toast here if you want
      });

      return () => unsubscribe();
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  return (
    <div>
      <ToastContainer />
      {token === "" ? (
        <Login setToken={setToken} url={url} />
      ) : (
        <>
          <Navbar setToken={setToken} url={url} token={token} adminPhoto={adminPhoto} />
          <hr />
          <div className='app-content'>
            <Sidebar />
            <Routes>
              <Route path='/' element={<Dashboard url={url} token={token} />} />
              <Route path='/add' element={<Add url={url} token={token} />} />
              <Route path='/orders' element={<Orders url={url} token={token} />} />
              <Route path='/list' element={<List url={url} token={token} />} />
              <Route path='/profile' element={<Profile url={url} token={token} setAdminPhoto={setAdminPhoto} />} />
              <Route path='/customers' element={<Customers url={url} token={token} />} />
            </Routes>
          </div>
        </>
      )}
    </div>
  )
}

export default App
