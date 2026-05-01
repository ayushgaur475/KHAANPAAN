import React, { useContext, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { StoreContext } from "../../context/StoreContext";

function Navbar({setShowLogin, theme, toggleTheme}) {
    const [menu, setMenu] = useState("home");

    const {getTotalCartAmount, token, setToken, search, setSearch, showSearch, setShowSearch, userData, url} = useContext(StoreContext);
    const navigate = useNavigate();
    const logout = () => {
       localStorage.removeItem("token");
       setToken("");
       navigate("/");
    }

  return ( 
    <div className='navbar'>
      <Link to='/'><img src={assets.logo} alt = "" className='logo'></img></Link>
      <ul className='navbar-menu'>
        <Link to='/' onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>Home</Link>
        <a href="#explore-menu" onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>Menu</a>
        <a href="#footer" onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>Contact Us</a>
      </ul>
      <div className='navbar-right'>
        <div className={`navbar-search-container ${showSearch ? 'active' : ''}`}>
          <img src={assets.search_icon} alt="" className='search-icon' onClick={() => setShowSearch(prev => !prev)}></img>
          {showSearch && (
            <input 
              type="text" 
              placeholder="Search for delicious food..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="navbar-search-input"
              autoFocus
            />
          )}
        </div>
        <div className='navbar-search-icon'>
           <Link to='/cart'><img src={assets.basket_icon}></img></Link>
            <div className={getTotalCartAmount()===0 ? "" : "dot"}></div>
        </div>
        <button onClick={toggleTheme} className='theme-toggle' title="Toggle Dark Mode">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        {!token?   <button onClick={() => setShowLogin(true)} className='sign-in-btn'>Sign In</button> 
        :
        <div className='navbar-profile-container'>
          <div className="navbar-coins" title="Your KP Coins">
            <span className="coin-icon">🪙</span>
            <span className="coin-balance">{userData.coins} KP</span>
          </div>
          <div className='navbar-profile'>
            <img src={userData.photo ? (userData.photo.startsWith('http') ? userData.photo : `${url}/images/${userData.photo}`) : assets.profile_icon} alt="Profile" className="nav-profile-img"></img>
            <ul className='nav-profile-dropdown'>
              <li onClick={() => navigate('/profile')}><img src={assets.profile_icon}></img><p>Profile</p></li>
              <hr></hr>
              <li onClick={() => navigate('/myorders')}><img src={assets.bag_icon}></img><p>Orders</p></li>
              <hr></hr>
              <li onClick={logout}><img src={assets.logout_icon}></img><p>Logout</p></li>
            </ul>
          </div>
        </div>
      }
      
      </div>
    </div>
  )
}

export default Navbar
