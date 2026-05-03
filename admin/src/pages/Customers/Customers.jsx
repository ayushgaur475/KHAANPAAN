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
            <span>Email</span>
            <span>Phone</span>
            <span>Joined On</span>
            <span>Orders</span>
          </div>
          {users.map((user, index) => (
            <div key={index} className="list-row">
              <div className="user-profile">
                <img src={user.photo ? (user.photo.startsWith('http') ? user.photo : `${url}/images/${user.photo}`) : "https://img.icons8.com/ios-filled/50/ff4c24/user-male-circle.png"} alt="" />
                <span>{user.name}</span>
              </div>
              <span>{user.email}</span>
              <span>{user.phone || "Not provided"}</span>
              <span>{new Date(user.createdAt || Date.now()).toLocaleDateString()}</span>
              <span className="coin-count">🪙 {user.coins} Coins</span>
            </div>
          ))}
          {users.length === 0 && <p className="no-data">No customers registered yet.</p>}
        </div>
      )}
    </div>
  )
}

export default Customers
