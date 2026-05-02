import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

function Cart() {
  const { cartItems, food_list, addToCart, removeFromCart, getTotalCartAmount, url, userData, appliedPromo, setAppliedPromo } =
    useContext(StoreContext);

  const [promoInput, setPromoInput] = React.useState("");

  const handleApplyPromo = () => {
    if (promoInput.toUpperCase() === "FOOD30") {
        // Treat undefined or null as true (First Timer)
        const isFirstOrder = userData.isFirstOrder !== false; 
        
        if (!isFirstOrder) {
            alert("Invalid or already used promo code!");
        } else if (subtotal < 100) {
            alert("This code is only for orders above ₹100!");
        } else {
            setAppliedPromo("FOOD30");
            alert("Promo Code Applied Successfully!");
        }
    } else {
        alert("Invalid Promo Code");
    }
  };

  const navigate = useNavigate();
  const subtotal = getTotalCartAmount();
  const isFirstTimer = userData.isFirstOrder !== false;
  const discount = (appliedPromo === "FOOD30" && isFirstTimer && subtotal >= 100) ? Math.floor(subtotal * 0.3) : 0;

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
                    <img src={typeof item.image === 'string' && item.image.startsWith('http') ? item.image : url + "/images/"+ item.image} alt={item.name}></img>
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
              <input type="text" placeholder="Promo Code" value={promoInput} onChange={(e) => setPromoInput(e.target.value)}></input>
              <button onClick={handleApplyPromo}>Apply</button>
            </div>
            {appliedPromo && <p style={{color: "green", marginTop: "10px", fontWeight: "600"}}>Code {appliedPromo} Applied!</p>}
          </div>
        </div>

        <div className="cart-total-container">
          <h2 className="summary-title">Order Summary</h2>
          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>₹{subtotal > 0 ? subtotal : 0}</p>
          </div>
          {discount > 0 && (
            <div className="cart-total-details discount-row">
              <p>Promo Discount (FOOD30)</p>
              <p>-₹{discount}</p>
            </div>
          )}
          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>₹{subtotal === 0 ? 0 : 2}</p>
          </div>
          <hr className="summary-hr" />
          <div className="cart-total-details total-row">
            <b>Total</b>
            <b>₹{subtotal === 0 ? 0 : subtotal + 2 - discount}</b>
          </div>
          <button className="checkout-btn" onClick={() => navigate('/order')}>PROCEED TO CHECKOUT</button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
