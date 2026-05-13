import React, { useState, useEffect } from 'react'
import './Marketing.css'
import axios from 'axios'
import { toast } from 'react-toastify'

const Marketing = ({ url }) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${url}/api/user/broadcast`, { title, message });
      if (response.data.success) {
        toast.success(response.data.message);
        setTitle('');
        setMessage('');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error sending broadcast notification");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='marketing-page'>
      <div className="marketing-header">
        <h2>Marketing & Announcements</h2>
        <p>Send real-time push notifications to all your registered customers.</p>
      </div>

      <div className="marketing-card glass-card">
        <div className="preview-mobile-wrapper">
          <div className="preview-mobile">
            {/* Dynamic Island */}
            <div className="dynamic-island"></div>
            
            {/* Status Bar */}
            <div className="status-bar-container">
              <div className="status-time">{currentTime}</div>
              <div className="status-icons">
                <span className="wifi">📶</span>
                <span className="battery">🔋</span>
              </div>
            </div>

            {/* Notification Preview */}
            <div className="notification-preview">
              <div className="notif-header">
                <div className="app-info">
                  <img src="https://khaanpaan-frontend.vercel.app/logo192.png" alt="logo" className="small-logo" />
                  <span className="app-name">KhaanPaan</span>
                </div>
                <span className="time">now</span>
              </div>
              <div className="notif-content">
                <strong>{title || "Your Title Here"}</strong>
                <p>{message || "Your promotional message will appear here..."}</p>
              </div>
            </div>

            {/* Virtual Home Screen Apps */}
            <div className="home-screen-apps">
              <div className="app-icon khaanpaan-app pulse">
                <img src="https://khaanpaan-frontend.vercel.app/logo192.png" alt="KhaanPaan" />
                <span>KhaanPaan</span>
              </div>
              <div className="app-icon dummy">
                <div className="icon-circle">📷</div>
                <span>Photos</span>
              </div>
              <div className="app-icon dummy">
                <div className="icon-circle">💬</div>
                <span>Chat</span>
              </div>
              <div className="app-icon dummy">
                <div className="icon-circle">🗺️</div>
                <span>Maps</span>
              </div>
            </div>
            
            <div className="home-indicator"></div>
          </div>
        </div>

        <form onSubmit={onSubmitHandler} className="marketing-form">
          <div className="form-group">
            <label>Notification Title</label>
            <input 
              type="text" 
              placeholder="e.g. Flash Sale! ⚡" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Message Content</label>
            <textarea 
              placeholder="e.g. Get 50% OFF on all orders above ₹200. Limited time only!" 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              required
            ></textarea>
          </div>
          <button type="submit" className="send-btn btn-premium" disabled={loading}>
            {loading ? "Sending..." : "🚀 Send to All Users"}
          </button>
          <p className="hint">This will send a push notification to every user who has enabled notifications.</p>
        </form>
      </div>
    </div>
  )
}

export default Marketing
