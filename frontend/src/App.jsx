import React, { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
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
import { useEffect } from 'react'

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
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
  {showLogin? <LoginPopup setShowLogin={setShowLogin}></LoginPopup>:<></>}
    <div className='app'>
      <Navbar setShowLogin={setShowLogin} theme={theme} toggleTheme={toggleTheme}/>
      <Routes>
        <Route path = '/' element={<Home/>}></Route>
        <Route path = '/Cart' element={<Cart/>}></Route>
        <Route path = '/order' element={<PlaceOrder/>}></Route>
        <Route path = '/verify' element={<Verify/>}/>
        <Route path = '/myorders' element={<MyOrders/>}/>
        <Route path = '/track/:orderId' element={<TrackOrder/>}/>
      </Routes>
    </div>
    <Footer></Footer>
    <CartBar />
    </>
}

export default App
