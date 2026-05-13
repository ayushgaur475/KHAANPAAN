import React, { useContext, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { StoreContext } from "../../context/StoreContext";

function Navbar({setShowLogin, theme, toggleTheme}) {
    const [menu, setMenu] = useState("home");

    const {getTotalCartAmount, token, setToken, search, setSearch, showSearch, setShowSearch, userData, url} = useContext(StoreContext);
    const [localSearch, setLocalSearch] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
      if (e.key === "Enter") {
        setSearch(localSearch);
        // Scroll to food display
        const foodDisplay = document.getElementById('food-display');
        if (foodDisplay) {
          foodDisplay.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }

    const logout = () => {
       localStorage.removeItem("token");
       setToken("");
       navigate("/");
    }

  return ( 
    <>
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
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                onKeyDown={handleSearch}
                className="navbar-search-input"
                autoFocus
              />
            )}
          </div>
          <div className='navbar-search-icon desktop-cart'>
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
              <img 
                src={userData.photo ? (userData.photo.startsWith('http') ? userData.photo : `${url}/images/${userData.photo}`) : assets.profile_icon} 
                alt="Profile" 
                className="nav-profile-img"
                onError={(e) => { e.target.onerror = null; e.target.src = assets.profile_icon; }}
              />
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

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="mobile-bottom-nav">
        <Link to='/' onClick={() => setMenu("home")} className={`nav-item ${menu === "home" ? "active" : ""}`}>
          <img src="https://img.icons8.com/material-rounded/48/ff4c24/home.png" alt="Home" />
          <span>Home</span>
        </Link>
        <a href="#explore-menu" onClick={() => setMenu("menu")} className={`nav-item ${menu === "menu" ? "active" : ""}`}>
          <img src="https://img.icons8.com/material-rounded/48/ff4c24/restaurant-menu.png" alt="Menu" />
          <span>Menu</span>
        </a>
        <Link to='/cart' onClick={() => setMenu("cart")} className={`nav-item cart-item ${menu === "cart" ? "active" : ""}`}>
          <div className="cart-icon-wrapper">
            <img src="https://img.icons8.com/material-rounded/48/ff4c24/shopping-basket.png" alt="Cart" />
            {getTotalCartAmount() > 0 && <div className="nav-dot"></div>}
          </div>
          <span>Cart</span>
        </Link>
        <Link to='/myorders' onClick={() => setMenu("orders")} className={`nav-item ${menu === "orders" ? "active" : ""}`}>
          <img src="https://img.icons8.com/material-rounded/48/ff4c24/shopping-bag.png" alt="Orders" />
          <span>Orders</span>
        </Link>
      </div>
    </>
  )
}

export default Navbar
