import React, { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import { assets } from './assets/assets'
import { Routes, Route, useLocation } from 'react-router-dom'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Cart from './pages/Cart/Cart'
import Home from './pages/Home/Home'
import Footer from './components/Footer/Footer'
import LoginPopup from './components/LoginPopup/LoginPopup'
import Verify from './pages/Verify/Verify'
import MyOrders from './pages/MyOrders/MyOrders'
import CartBar from './components/CartBar/CartBar'
import TrackOrder from './pages/TrackOrder/TrackOrder'
import Profile from './pages/Profile/Profile'
import { useEffect } from 'react'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { messaging, getToken, onMessage } from './config/firebase';
import axios from 'axios';

function App() {
  console.log("🚀 DEBUG: APP COMPONENT LOADED - VERSION 2.1 - FRESH BUILD");
  const [showLogin, setShowLogin] = useState(false);
  const token = localStorage.getItem("token"); // Track token for sync
  const url = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://127.0.0.1:5001"
    : "https://khaanpaan-backend.onrender.com";

  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        const registration = await navigator.serviceWorker.ready;
        const fcmToken = await getToken(messaging, { 
          vapidKey: "BB-3hzSp7qof1IbETD-yTRzLaNvwS_3U5HEfJINPZa5yihG5gpCyBP7_uV92JQjaqvvhtgVm11pDbd7gynFPeko",
          serviceWorkerRegistration: registration
        });
        if (fcmToken && token) {
          await axios.post(url + "/api/user/update-fcm-token", { fcmToken }, { headers: { token } });
          console.log("✅ Customer Token Synced:", fcmToken);
        }
      }
    } catch (error) {
      console.error("Error setting up notifications:", error);
    }
  };

  useEffect(() => {
    requestNotificationPermission();
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
    });
    return () => unsubscribe();
  }, [token]); // Re-run when token changes (login/logout)
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isBannerDismissed, setIsBannerDismissed] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    });
  }, []);

  const handleInstallClick = () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    installPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }
      setInstallPrompt(null);
    });
  };

  const dismissBanner = () => {
    setIsBannerDismissed(true);
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [pathname]);

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return <>
  <ToastContainer />
  {showLogin? <LoginPopup setShowLogin={setShowLogin}></LoginPopup>:<></>}
    <div className='app'>
      <Navbar setShowLogin={setShowLogin} theme={theme} toggleTheme={toggleTheme} installPrompt={installPrompt} handleInstallClick={handleInstallClick}/>
      {installPrompt && !isBannerDismissed && (
        <div className="install-banner">
          <div className="install-content">
            <button className="close-banner" onClick={dismissBanner}>&times;</button>
            <img src={assets.logo} alt="Logo" className="install-logo" />
            <div className="install-text">
              <p>Download KhaanPaan App</p>
              <span>Install for a faster experience!</span>
            </div>
          </div>
          <button className="install-btn" onClick={handleInstallClick}>Install</button>
        </div>
      )}
      <Routes>
        <Route path = '/' element={<Home setShowLogin={setShowLogin}/>}></Route>
        <Route path = '/Cart' element={<Cart/>}></Route>
        <Route path = '/order' element={<PlaceOrder/>}></Route>
        <Route path = '/verify' element={<Verify/>}/>
        <Route path = '/myorders' element={<MyOrders/>}/>
        <Route path = '/track/:orderId' element={<TrackOrder/>}/>
        <Route path = '/profile' element={<Profile/>}/>
      </Routes>
    </div>
    <Footer></Footer>
    {pathname !== '/Cart' && <CartBar />}
    </>
}

export default App
