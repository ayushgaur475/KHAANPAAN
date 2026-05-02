import React, { useEffect, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Navbar({ url, token, setToken, adminPhoto }) {
  const [theme, setTheme] = useState(localStorage.getItem("admin-theme") || "light");
  const [localPhoto, setLocalPhoto] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.body.className = theme === "dark" ? "dark-mode" : "";
    localStorage.setItem("admin-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (token && url) {
      axios.post(`${url}/api/user/info`, {}, { headers: { token } })
        .then(res => {
          if (res.data.success && res.data.photo) {
            setLocalPhoto(res.data.photo);
          }
        })
        .catch(console.error);
    }
  }, [token, url]);

  // adminPhoto from parent overrides the initial fetch when updated
  const displayPhoto = adminPhoto || localPhoto;

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  }

  const profileSrc = displayPhoto ? (displayPhoto.startsWith('http') ? displayPhoto : `${url}/images/${displayPhoto}`) : assets.profile_image;

  return (
    <div className='navbar glass-card'>
      <div className="navbar-left">
        <img className='logo' src={assets.logo} alt ="KhaanPaan"></img>
        <span className="admin-badge">Admin Panel</span>
      </div>
      <div className="navbar-right">
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "light" ? "🌙" : "☀️"}
        </button>
        <div className="profile-container" onClick={() => navigate('/profile')} title="Edit Profile">
          <img className='profile' src={profileSrc} alt='Profile'></img>
          <div className="status-dot"></div>
        </div>
        <button className="logout-btn" onClick={() => setToken("")} title="Logout">
           Logout
        </button>
      </div>
    </div>
  )
}

export default Navbar

