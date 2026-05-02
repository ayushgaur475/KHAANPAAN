import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PlaceOrder() {
  const { getTotalCartAmount, token, food_list, cartItems, url, userData, addToCart, removeFromCart, appliedPromo } =
    useContext(StoreContext);
  const [useCoins, setUseCoins] = useState(false);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    });
    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
      useCoins: useCoins,
      promoCode: appliedPromo
    };
    let response = await axios.post(url +"/api/order/place", orderData, {
      headers: { token },
    });
    if (response.data.success) {
      const { session_url } = response.data;
      window.open(session_url, "_blank");
      navigate("/myorders"); // Optional: Navigate to orders page in the background tab
    } else {
      alert(response.data.message);
    }
  };
  const navigate = useNavigate();
  useEffect(() => {
   if(!token){
    navigate('/cart');
   }
   else if(getTotalCartAmount() === 0){
    navigate('/cart')
   }
  }, [token])
  
  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <h2 className="title">Delivery Information</h2>
        <div className="multi-fields">
          <input
            required
            type="text"
            name="firstName"
            onChange={onChangeHandler}
            value={data.firstName}
            placeholder="First Name"
          />
          <input
            required
            type="text"
            name="lastName"
            onChange={onChangeHandler}
            value={data.lastName}
            placeholder="Last Name"
          />
        </div>
        <input
          type="email"
          name="email"
          className="full-input"
          onChange={onChangeHandler}
          value={data.email}
          placeholder="Email Address"
        />
        <input
          required
          type="text"
          name="street"
          className="full-input"
          onChange={onChangeHandler}
          value={data.street}
          placeholder="Street Address"
        />
        <div className="multi-fields">
          <input
            required
            type="text"
            name="city"
            onChange={onChangeHandler}
            value={data.city}
            placeholder="City"
          />
          <input
            required
            type="text"
            name="state"
            onChange={onChangeHandler}
            value={data.state}
            placeholder="State"
          />
        </div>
        <div className="multi-fields">
          <input
            required
            type="text"
            name="zipcode"
            onChange={onChangeHandler}
            value={data.zipcode}
            placeholder="Pincode"
          />
          <input
            required
            type="text"
            name="country"
            onChange={onChangeHandler}
            value={data.country}
            placeholder="Country"
          />
        </div>
        <input
          required
          type="text"
          name="phone"
          className="full-input"
          onChange={onChangeHandler}
          value={data.phone}
          placeholder="Phone Number"
        />
      </div>
      <div className="place-order-right">
        <div className="loyalty-section glass-card">
          <div className="loyalty-header">
            <span className="coin-icon">🪙</span>
            <h3>KhaanPaan Rewards</h3>
          </div>
          <div className="loyalty-content">
            <p>You have <b>{userData.coins}</b> coins available</p>
            {userData.coins > 0 && (
              <div className="coin-toggle">
                <input 
                  type="checkbox" 
                  id="useCoins" 
                  checked={useCoins} 
                  onChange={() => setUseCoins(!useCoins)} 
                />
                <label htmlFor="useCoins">Use coins for ₹{Math.min(userData.coins, getTotalCartAmount() + 2)} discount</label>
              </div>
            )}
            <div className="coins-to-earn">
               <span>Earn <b>{Math.floor((getTotalCartAmount() - (useCoins ? Math.min(userData.coins, getTotalCartAmount()) : 0)) * 0.05)}</b> coins on this order</span>
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
          {appliedPromo === "FOOD30" && (userData.isFirstOrder !== false) && getTotalCartAmount() >= 100 && (
            <div className="cart-total-details discount-row">
              <p>Promo Discount (FOOD30)</p>
              <p>-₹{Math.floor(getTotalCartAmount() * 0.3)}</p>
            </div>
          )}
          {useCoins && userData.coins > 0 && (
            <div className="cart-total-details discount-row">
              <p>Coin Discount</p>
              <p>- ₹{Math.min(userData.coins, getTotalCartAmount() + 2 - (appliedPromo === "FOOD30" && (userData.isFirstOrder !== false) && getTotalCartAmount() >= 100 ? Math.floor(getTotalCartAmount() * 0.3) : 0))}</p>
            </div>
          )}
          <hr className="summary-hr" />
          <div className="cart-total-details total-row">
            <b>Total</b>
            <b>
              ₹{Math.max(0, 
                (getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2) 
                - (appliedPromo === "FOOD30" && (userData.isFirstOrder !== false) && getTotalCartAmount() >= 100 ? Math.floor(getTotalCartAmount() * 0.3) : 0)
                - (useCoins ? Math.min(userData.coins, getTotalCartAmount() + 2 - (appliedPromo === "FOOD30" && (userData.isFirstOrder !== false) && getTotalCartAmount() >= 100 ? Math.floor(getTotalCartAmount() * 0.3) : 0)) : 0)
              )}
            </b>
          </div>
          <button type="submit" className="payment-btn">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
}

export default PlaceOrder;
