import React from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'
function Sidebar() {
  return (
    <div className='sidebar'>
      <div className='sidebar-options'>
        <NavLink to='/' className='sidebar-option'>
          <img src={assets.order_icon}></img>
          <p>Dashboard</p>
        </NavLink>
        <NavLink to='/add'className='sidebar-option'>
          <img src={assets.add_icon}></img>
          <p>Add Items</p>
        </NavLink>
        <NavLink to='/list' className='sidebar-option'>
          <img src={assets.order_icon}></img>
          <p>List Items</p>
        </NavLink>
        <NavLink to='/orders' className='sidebar-option'>
          <img src={assets.order_icon}></img>
          <p>Orders</p>
        </NavLink>
        <NavLink to='/customers' className='sidebar-option'>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff4c24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <p>Customers</p>
        </NavLink>
      </div>
      
    </div>
  )
}

export default Sidebar
