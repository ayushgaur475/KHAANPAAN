import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

function Footer() {
  return (
    <div className='footer' id = 'footer'>
      <div className='footer-content'>
        <div className='footer-content-left'>
            <img src={assets.logo} className='footer-logo' alt=""></img>
            <p>Welcome to KHAANPAAN, where culinary passion meets exquisite taste. Our platform is your gateway to a world of authentic, flavorful dishes crafted with the finest ingredients and a touch of love. Whether you're seeking traditional recipes or modern culinary delights, KHAANPAAN promises an unforgettable gastronomic journey.</p>
            <div className='footer-social-icons'>
                <img src={assets.facebook_icon} alt=""></img>
                <img src={assets.twitter_icon} alt=""></img>
                <img src={assets.linkedin_icon} alt=""></img>
            </div>
            <div className='footer-app-download'>
                <img src={assets.play_store} alt=''></img>
                <img src={assets.app_store} alt=''></img>
            </div>
        </div>
        <div className='footer-content-right'>
            <h2>COMPANY</h2>
            <ul>
                <li>Home</li>
                <li>About Us</li>
                <li>Delivery</li>
                <li>Privacy Policy</li>
            </ul>
        </div>
        <div className='footer-content-centre'>
             <h2>GET IN TOUCH</h2>
             <ul>
                <li>+91-XXXXXXXXXX</li>
                <li>contact@khaanpaan.com</li>
             </ul>
        </div>
      </div>
      <hr/>
      <p className='footer-copyright'>Copyright 2026 KHAANPAAN.com - All Rights Reserved.</p>
    </div>
  )
}

export default Footer
