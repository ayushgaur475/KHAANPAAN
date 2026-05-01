import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './MyOrders.css'
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';

const MyOrders = () => {

    const {url,token} = useContext(StoreContext);
    const [data,setData] = useState([]);
    const navigate = useNavigate();

    const fetchOrders = async () => {
        const response = await axios.post(url+"/api/order/userorders",{},{headers:{token}});
        setData(response.data.data);
    }

    useEffect(()=>{
        if (token) {
            fetchOrders();
        }
    },[token])

  return (
    <div className='my-orders'>
        <h2 className='myordersp'>My Orders</h2>
        <div className="container">
            {data.map((order,index)=>{
                return (
                    <div key={index} className='my-orders-order'>
                        <div className="order-icon-container">
                            <img src={assets.parcel_icon} alt="Order" />
                        </div>
                        <div className="order-items-info">
                            <p className="order-items-text">{order.items.map((item,index)=>{
                                if (index === order.items.length-1) {
                                    return item.name+" x "+item.quantity
                                }
                                else{
                                    return item.name+" x "+item.quantity+", "
                                }
                            })}</p>
                            <p className="order-date">{new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                        <p className="order-amount">₹{order.amount}.00</p>
                        <p className="order-item-count"><span>{order.items.length}</span> items</p>
                        <div className="status-container">
                            <p className="status-badge">
                                <span className={`status-dot ${
                                    order.status === "Delivered" ? "status-delivered" : 
                                    order.status === "Out for delivery" ? "status-delivery" : 
                                    order.status === "Ready for Pickup" ? "status-ready" :
                                    order.status === "Order Placed" ? "status-placed" :
                                    order.status === "Preparing" ? "status-preparing" :
                                    order.status === "Cancelled" ? "status-cancelled" :
                                    "status-processing"
                                }`}></span> 
                                <b className="status-text">{order.status}</b>
                            </p>
                            <p className="update-time">Updated: {new Date(order.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                        {order.status !== "Delivered" && order.status !== "Cancelled" && (
                            <button className="track-btn" onClick={() => navigate(`/track/${order._id}`)}>Track Order</button>
                        )}
                    </div>
                )
            })}
        </div>
    </div>
  )
}

export default MyOrders