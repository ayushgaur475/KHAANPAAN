import React, { useEffect, useState } from 'react'
import './Dashboard.css'
import axios from 'axios'
import { toast } from 'react-toastify'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = ({ url, token }) => {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        todayRevenue: 0,
        weekRevenue: 0,
        totalOrders: 0,
        totalUsers: 0,
        recentOrders: [],
        dailyRevenue: []
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

            <div className="charts-grid">
                <div className="chart-container glass-card">
                    <div className="chart-header">
                        <h3>Revenue Trend (Last 7 Days)</h3>
                        <p>Daily earnings performance</p>
                    </div>
                    <div className="chart-body">
                        <Line 
                            data={{
                                labels: stats.dailyRevenue.map(d => new Date(d._id).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })),
                                datasets: [
                                    {
                                        label: 'Revenue (₹)',
                                        data: stats.dailyRevenue.map(d => d.revenue),
                                        borderColor: '#ff4c24',
                                        backgroundColor: 'rgba(255, 76, 36, 0.1)',
                                        fill: true,
                                        tension: 0.4,
                                        pointRadius: 4,
                                        pointBackgroundColor: '#ff4c24'
                                    }
                                ]
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: {
                                    y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
                                    x: { grid: { display: false } }
                                }
                            }}
                        />
                    </div>
                </div>

                <div className="chart-container glass-card">
                    <div className="chart-header">
                        <h3>Order Volume</h3>
                        <p>Daily total orders</p>
                    </div>
                    <div className="chart-body">
                        <Bar 
                            data={{
                                labels: stats.dailyRevenue.map(d => new Date(d._id).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })),
                                datasets: [
                                    {
                                        label: 'Orders',
                                        data: stats.dailyRevenue.map(d => d.orders),
                                        backgroundColor: '#4a90e2',
                                        borderRadius: 8
                                    }
                                ]
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: {
                                    y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
                                    x: { grid: { display: false } }
                                }
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="recent-activity">
                <div className="activity-header">
                    <h3>Recent Paid Orders</h3>
                    <button onClick={fetchAnalytics} className="refresh-btn">Refresh</button>
                </div>
                <div className="activity-table">
                    <div className="table-header">
                        <span>Customer Name</span>
                        <span>Ordered Items</span>
                        <span>Amount</span>
                        <span>Status</span>
                    </div>
                    {stats.recentOrders.map((order, index) => (
                        <div key={index} className="table-row">
                            <span className="user-name-bold">{order.address.firstName} {order.address.lastName}</span>
                            <span className="items-text">
                                {order.items.map((item, idx) => (
                                    item.name + (idx === order.items.length - 1 ? "" : ", ")
                                ))}
                            </span>
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
