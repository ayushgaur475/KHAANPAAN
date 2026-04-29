import React, { useContext } from 'react'
import './CartBar.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate, useLocation } from 'react-router-dom';

const CartBar = () => {
    const { cartItems, getTotalCartAmount } = useContext(StoreContext);
    const navigate = useNavigate();
    const location = useLocation();

    // Hide if on cart page or if cart is empty
    const totalItems = Object.values(cartItems).reduce((sum, count) => sum + count, 0);

    if (totalItems === 0 || location.pathname === '/Cart' || location.pathname === '/cart') {
        return null;
    }

    const handleViewCart = () => {
        navigate('/cart');
        window.scrollTo(0, 0);
    };

    return (
        <div className='cart-bar'>
            <div className='cart-bar-content'>
                <div className='cart-bar-info'>
                    <span className='cart-bar-count'>{totalItems} {totalItems === 1 ? 'item' : 'items'} added</span>
                    <span className='cart-bar-divider'>|</span>
                    <span className='cart-bar-total'>₹{getTotalCartAmount()}</span>
                </div>
                <button className='cart-bar-btn' onClick={handleViewCart}>
                    View Cart
                    <i className="fa-solid fa-arrow-right"></i>
                </button>
            </div>
        </div>
    )
}

export default CartBar
