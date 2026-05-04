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
        <h2>Customer Management</h2>
        <p>Monitor all registered users on KhaanPaan</p>
        <button onClick={fetchUsers} className="refresh-btn">Refresh List</button>
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
                <img src={user.photo ? (user.photo.startsWith('http') ? user.photo : `${url}/images/${user.photo}`) : "https://img.icons8.com/ios-filled/50/ff4c24/user-male-circle.png"} alt="" />
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
