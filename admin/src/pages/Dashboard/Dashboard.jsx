import React, { useEffect, useState } from 'react'
import './Dashboard.css'
import axios from 'axios'
import { toast } from 'react-toastify'

const Dashboard = ({ url, token }) => {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        todayRevenue: 0,
        weekRevenue: 0,
        totalOrders: 0,
        totalUsers: 0,
        recentOrders: []
    })

    const fetchAnalytics = async () => {
        try {
            const response = await axios.get(`${url}/api/order/analytics`, { headers: { token } });
            if (response.data.success) {
                // Check if new order arrived for notification
                if (stats.totalOrders > 0 && response.data.totalOrders > stats.totalOrders) {
                    toast.info("🔔 New order received!");
                    new Audio('/notification.mp3').play().catch(e => console.log("Audio play failed"));
                }
                setStats(response.data);
            }
        } catch (error) {
            console.error("Error fetching analytics", error);
        }
    }

    useEffect(() => {
        fetchAnalytics();
        const interval = setInterval(fetchAnalytics, 10000); // Update every 10 seconds for real-time feel
        return () => clearInterval(interval);
    }, [token, stats.totalOrders]);

    return (
        <div className='dashboard'>
            <div className="dashboard-header">
                <h2>Business Analytics</h2>
                <p>Monitor your restaurant's performance in real-time</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card revenue">
                    <div className="stat-info">
                        <p>Total Revenue</p>
                        <h3>₹{stats.totalRevenue.toLocaleString('en-IN')}</h3>
                    </div>
                    <div className="stat-icon-bg">💰</div>
                </div>

                <div className="stat-card today">
                    <div className="stat-info">
                        <p>Today's Earnings</p>
                        <h3>₹{stats.todayRevenue.toLocaleString('en-IN')}</h3>
                    </div>
                    <div className="stat-icon-bg">📅</div>
                </div>

                <div className="stat-card week">
                    <div className="stat-info">
                        <p>Weekly Earnings</p>
                        <h3>₹{stats.weekRevenue.toLocaleString('en-IN')}</h3>
                    </div>
                    <div className="stat-icon-bg">📈</div>
                </div>

                <div className="stat-card orders">
                    <div className="stat-info">
                        <p>Total Orders</p>
                        <h3>{stats.totalOrders}</h3>
                    </div>
                    <div className="stat-icon-bg">📦</div>
                </div>

                <div className="stat-card users">
                    <div className="stat-info">
                        <p>Total Customers</p>
                        <h3>{stats.totalUsers}</h3>
                    </div>
                    <div className="stat-icon-bg">👥</div>
                </div>
            </div>

            <div className="recent-activity">
                <div className="activity-header">
                    <h3>Recent Paid Orders</h3>
                    <button onClick={fetchAnalytics} className="refresh-btn">Refresh</button>
                </div>
                <div className="activity-table">
                    <div className="table-header">
                        <span>Customer ID</span>
                        <span>Items</span>
                        <span>Amount</span>
                        <span>Status</span>
                    </div>
                    {stats.recentOrders.map((order, index) => (
                        <div key={index} className="table-row">
                            <span className="user-id">...{order.userId.slice(-6)}</span>
                            <span>{order.items.length} items</span>
                            <span className="amount">₹{order.amount}</span>
                            <span className={`status-pill ${order.status.toLowerCase().replace(/ /g, '-')}`}>{order.status}</span>
                        </div>
                    ))}
                    {stats.recentOrders.length === 0 && <p className="no-data">No recent paid orders found.</p>}
                </div>
            </div>
        </div>
    )
}

export default Dashboard
