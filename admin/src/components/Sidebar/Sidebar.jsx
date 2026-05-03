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
          <img src="https://img.icons8.com/ios-filled/50/ff4c24/group.png"></img>
          <p>Customers</p>
        </NavLink>
      </div>
      
    </div>
  )
}

export default Sidebar
