import React, { useState } from 'react'
import './Header.css'

function Header() {
  // Array of local video paths. 
  // You need to place your video files inside the "frontend/public" folder!
  const videos = [
    "/video1.mp4"
  ];

  const [playCount, setPlayCount] = useState(0);

  const handleVideoEnd = () => {
    setPlayCount((prevCount) => prevCount + 1);
  };

  // Currently you only have video1.mp4 in your folder. 
  // You can add more here if you upload them to the public folder!
  const currentVideoSrc = videos[playCount % videos.length];

  return (
    <div className='header'>
      <video
        key={playCount}
        autoPlay
        muted
        playsInline
        className='header-video'
        src={currentVideoSrc}
        onEnded={handleVideoEnd}
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
