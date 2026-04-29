import React, { useEffect, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'

function Navbar() {
  const [theme, setTheme] = useState(localStorage.getItem("admin-theme") || "light");

  useEffect(() => {
    document.body.className = theme === "dark" ? "dark-mode" : "";
    localStorage.setItem("admin-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  }

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
        <div className="profile-container">
          <img className='profile' src={assets.profile_image} alt='Profile'></img>
          <div className="status-dot"></div>
        </div>
      </div>
    </div>
  )
}

export default Navbar

