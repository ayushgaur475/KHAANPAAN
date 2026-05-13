import React, { useState } from 'react'
import './Marketing.css'
import axios from 'axios'
import { toast } from 'react-toastify'

const Marketing = ({ url }) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

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
        <div className="preview-mobile">
          <div className="status-bar">9:41</div>
          <div className="notification-preview">
            <div className="notif-header">
              <span className="app-name">🍕 KhaanPaan</span>
              <span className="time">now</span>
            </div>
            <div className="notif-content">
              <strong>{title || "Your Title Here"}</strong>
              <p>{message || "Your promotional message will appear here..."}</p>
            </div>
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
