import React, { useEffect, useState } from 'react'
import './Customers.css'
import axios from 'axios'
import { toast } from 'react-toastify'

const Customers = ({ url }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${url}/api/user/list-users`);
      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        toast.error("Error fetching users");
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const getJoinedDate = (user) => {
    if (user.createdAt) return new Date(user.createdAt);
    if (user._id) return new Date(parseInt(user._id.substring(0, 8), 16) * 1000);
    return new Date();
  };

  return (
    <div className='customers-page'>
      <div className="customers-header">
        <div className="header-info">
          <h2>Customer Management</h2>
          <p>Monitor and manage all registered users on KhaanPaan</p>
        </div>
        <button onClick={fetchUsers} className="refresh-btn premium-btn">
          <span>🔄 Refresh List</span>
        </button>
      </div>

      <div className="customers-stats-row">
        <div className="stats-card glass-card">
          <div className="stats-icon">👥</div>
          <div className="stats-data">
            <span className="stats-label">Total Customers</span>
            <span className="stats-value">{users.length}</span>
          </div>
          <div className="stats-badge">Active Users</div>
        </div>
        <div className="stats-card glass-card">
          <div className="stats-icon">💰</div>
          <div className="stats-data">
            <span className="stats-label">Total Coins Issued</span>
            <span className="stats-value">{users.reduce((acc, user) => acc + (user.coins || 0), 0)}</span>
          </div>
          <div className="stats-badge secondary">KP Ecosystem</div>
        </div>
      </div>

      {loading ? (
        <div className="loader">Loading customers...</div>
      ) : (
        <div className="customers-list">
          <div className="list-header">
            <span>Customer</span>
            <span>Email Address</span>
            <span>Phone</span>
            <span>Joined On</span>
            <span>Loyalty Coins</span>
          </div>
          {users.map((user, index) => (
            <div key={index} className="list-row">
              <div className="user-profile">
                <img 
                  src={user.photo ? (user.photo.startsWith('http') || user.photo.startsWith('data:') ? user.photo : `${url}/images/${user.photo}`) : "https://img.icons8.com/ios-filled/50/ff4c24/user-male-circle.png"} 
                  alt="" 
                  onError={(e) => { e.target.src = "https://img.icons8.com/ios-filled/50/ff4c24/user-male-circle.png" }}
                />
                <span className="user-name">{user.name}</span>
              </div>
              <span className="user-email">{user.email}</span>
              <span className="user-phone">{user.phone || "—"}</span>
              <span className="user-date">{getJoinedDate(user).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              <span className="coin-count">🪙 {user.coins} KP Coins</span>
            </div>
          ))}
          {users.length === 0 && <p className="no-data">No customers registered yet.</p>}
        </div>
      )}
    </div>
  )
}

export default Customers
