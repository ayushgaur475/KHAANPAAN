import React, { useState } from 'react'
import './Header.css'

function Header() {

  return (
    <div className='header'>
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className='header-video'
        src="/video1.mp4"
      >
        Your browser does not support the video tag.
      </video>
      <div className='header-contents'>
        <h2>Bhookh Lagi Hai? Khaanpaan Hai Na!</h2>
        <p>
          Better food for more people! Discover new tastes and authentic flavors, delivered right to your doorstep. Ghar jaisa swaad ho ya premium restaurant ki craving, Khaanpaan is here to satisfy your hunger.
        </p>
        <button>View Menu</button>
      </div>
    </div>
  )
}

export default Header
