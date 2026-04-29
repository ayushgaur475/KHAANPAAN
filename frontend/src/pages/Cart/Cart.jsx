import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

function Cart() {
  const { cartItems, food_list, addToCart, removeFromCart, getTotalCartAmount, url } =
    useContext(StoreContext);

    const navigate = useNavigate();
  return (
    <div className="cart">
      <h2 className="cart-title">Your Shopping Cart</h2>
      <div className="cart-items">
        <div className="cart-items-header">
          <p>Product</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
        </div>
        <div className="cart-items-list">
          {food_list.map((item, index) => {
            if (cartItems[item._id] > 0) {
              return (
                <div key={item._id} className="cart-item-row">
                  <div className="cart-item-img">
                    <img src={url + "/images/"+ item.image} alt={item.name}></img>
                  </div>
                  <p className="cart-item-name">{item.name}</p>
                  <p className="cart-item-price">₹{item.price}</p>
                  <div className="cart-item-quantity-controls">
                    <button onClick={() => removeFromCart(item._id)} className="qty-btn minus">-</button>
                    <span>{cartItems[item._id]}</span>
                    <button onClick={() => addToCart(item._id)} className="qty-btn plus">+</button>
                  </div>
                  <p className="cart-item-total">₹{item.price * cartItems[item._id]}</p>
                </div>
              );
            }
          })}
        </div>
      </div>
      
      <div className="cart-bottom">
        <div className="cart-promocode">
          <div className="promo-container">
            <p className="promo-text">Have a promo code? Enter it here</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder="Promo Code"></input>
              <button>Apply</button>
            </div>
          </div>
        </div>

        <div className="cart-total-container">
          <h2 className="summary-title">Order Summary</h2>
          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>₹{getTotalCartAmount() > 0 ? getTotalCartAmount() : 0}</p>
          </div>
          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>₹{getTotalCartAmount() === 0 ? 0 : 2}</p>
          </div>
          <hr className="summary-hr" />
          <div className="cart-total-details total-row">
            <b>Total</b>
            <b>₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
          </div>
          <button className="checkout-btn" onClick={() => navigate('/order')}>PROCEED TO CHECKOUT</button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
