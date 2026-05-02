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
import { useState, useEffect } from 'react'

function App() {
  const url = (import.meta.env.VITE_BACKEND_URL ? import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "") : "http://localhost:4000");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [adminPhoto, setAdminPhoto] = useState('');

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
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
            </Routes>
          </div>
        </>
      )}
    </div>
  )
}

export default App
