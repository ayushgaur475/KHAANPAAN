import React, { useEffect, useState } from "react";
import "./Orders.css";
import { toast } from "react-toastify";
import axios from "axios";
import { assets } from "../../assets/assets";

const Orders = ({ url, token }) => {
  const [orders, setOrders] = useState([]);
  const [orderCount, setOrderCount] = useState(0);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(url + "/api/order/list", {headers:{token}});
      console.log("📦 Orders API Response:", response.data);
      if (response.data.success) {
        const newOrders = response.data.data;
        
        // Sound logic: If count increases, play sound
        if (newOrders.length > orderCount && orderCount !== 0) {
          const audio = new Audio('/notification.mp3');
          audio.play().catch(e => console.log("Sound blocked by browser"));
          toast.info("🛎️ New Order Received!");
        }
        
        setOrders(newOrders);
        setOrderCount(newOrders.length);
      } else {
        toast.error("Error fetching orders");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const statusHandler = async (event, orderId) => {
    const response = await axios.post(url + "/api/order/status", {
      orderId,
      status: event.target.value,
    }, {headers:{token}});
    if (response.data.success) {
      await fetchAllOrders();
    }
  };

  const refundHandler = async (orderId) => {
    try {
      const response = await axios.post(url + "/api/order/refund", { orderId }, { headers: { token } });
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchAllOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error issuing refund.");
    }
  };

  useEffect(() => {
    fetchAllOrders();
    const interval = setInterval(fetchAllOrders, 10000); // Auto-refresh every 10 seconds
    return () => clearInterval(interval);
  }, [token, orderCount]);

  return (
    <div className='orders-page'>
      <div className="orders-container">
        <div className="orders-header">
          <h2 className="page-title">Customer Orders</h2>
          <p className="order-count">{orders.length} active orders</p>
        </div>
        
        <div className="order-list">
          {orders.map((order, index) => (
            <div key={index} className="order-card glass-card">
              <div className="order-card-header">
                <div className="parcel-img-wrapper">
                  <img src={assets.parcel_icon} alt="Parcel" />
                </div>
                <div className="order-summary">
                  <p className="order-items-list">
                    {order.items.map((item, idx) => {
                      return item.name + " x " + item.quantity + (idx === order.items.length - 1 ? "" : ", ");
                    })}
                  </p>
                  <p className="customer-name">{order.address.firstName + " " + order.address.lastName}</p>
                </div>
                <div className="order-amount-status">
                  <p className="order-price">₹{order.amount}</p>
                  <span className={`status-pill ${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="order-card-details">
                <div className="detail-section">
                  <p className="detail-label">Delivery Address</p>
                  <div className="address-info">
                    <p>{order.address.street}</p>
                    <p>{`${order.address.city}, ${order.address.state}, ${order.address.zipcode}`}</p>
                    <p className="phone-number">📞 {order.address.phone}</p>
                  </div>
                </div>
                
                <div className="detail-section">
                  <p className="detail-label">Order Progress</p>
                  <select 
                    className="status-select input-field"
                    onChange={(event) => statusHandler(event, order._id)}
                    value={order.status}
                  >
                    <option value="Order Placed">Order Placed</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Ready for Pickup">Ready for Pickup</option>
                    <option value="Out for delivery">Out for delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  {order.status === "Cancelled" && order.payment && !order.refunded && (
                    <button onClick={() => refundHandler(order._id)} className="refund-btn">
                      Refund to Wallet
                    </button>
                  )}
                  {order.refunded && (
                    <span className="refunded-badge">Refunded ✓</span>
                  )}
                </div>
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <div className="empty-state glass-card">No active orders found.</div>
          )}
        </div>
      </div>
    </div>

  );
};

export default Orders;
