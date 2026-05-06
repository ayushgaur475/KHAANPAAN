import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PlaceOrder() {
  const { getTotalCartAmount, token, food_list, cartItems, url, userData, fetchUserData, appliedPromo } =
    useContext(StoreContext);
  const [useCoins, setUseCoins] = useState(false);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(-1);
  const [saveAddress, setSaveAddress] = useState(true);
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

  useEffect(() => {
    if (userData.addresses && userData.addresses.length > 0 && selectedAddressIndex === -1 && !showNewAddressForm) {
      setSelectedAddressIndex(0);
      setData(userData.addresses[0]);
    } else if (!userData.addresses || userData.addresses.length === 0) {
      setShowNewAddressForm(true);
    }
  }, [userData.addresses]);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  };

  const handleAddressSelect = (index) => {
    setSelectedAddressIndex(index);
    setData(userData.addresses[index]);
    setShowNewAddressForm(false);
  };

  const handleAddNewAddress = () => {
    setSelectedAddressIndex(-1);
    setData({
      firstName: "",
      lastName: "",
      email: userData.email || "",
      street: "",
      city: "",
      state: "",
      zipcode: "",
      country: "",
      phone: userData.phone || "",
    });
    setShowNewAddressForm(true);
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    
    // If it's a new address and 'saveAddress' is checked, save it first
    if (showNewAddressForm && saveAddress) {
      try {
        await axios.post(url + "/api/user/add-address", { address: data }, { headers: { token } });
        await fetchUserData(token);
      } catch (error) {
        console.error("Error saving address:", error);
      }
    }

    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = { ...item };
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

    try {
      let response = await axios.post(url + "/api/order/place", orderData, {
        headers: { token },
      });
      if (response.data.success) {
        const { session_url } = response.data;
        window.open(session_url, "_blank");
        navigate("/myorders");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Error placing order. Please try again.");
    }
  };

  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate('/cart');
    }
    else if (getTotalCartAmount() === 0) {
      navigate('/cart')
    }
  }, [token])

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <h2 className="title">Delivery Information</h2>
        
        {userData.addresses && userData.addresses.length > 0 && (
          <div className="saved-addresses-container">
            <p className="section-subtitle">Select a saved address</p>
            <div className="addresses-grid">
              {userData.addresses.map((addr, index) => (
                <div 
                  key={index} 
                  className={`address-card ${selectedAddressIndex === index && !showNewAddressForm ? 'active' : ''}`}
                  onClick={() => handleAddressSelect(index)}
                >
                  <p className="addr-name">{addr.firstName} {addr.lastName}</p>
                  <p className="addr-text">{addr.street}, {addr.city}</p>
                  <p className="addr-text">{addr.state}, {addr.zipcode}</p>
                  <p className="addr-phone">📞 {addr.phone}</p>
                  {selectedAddressIndex === index && !showNewAddressForm && <div className="selected-badge">✓ Selected</div>}
                </div>
              ))}
              <div 
                className={`address-card add-new-card ${showNewAddressForm ? 'active' : ''}`}
                onClick={handleAddNewAddress}
              >
                <div className="add-icon">+</div>
                <p>Add New Address</p>
              </div>
            </div>
          </div>
        )}

        {showNewAddressForm && (
          <div className="new-address-form animate-fade-in">
            <p className="section-subtitle">Enter New Delivery Details</p>
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
            <div className="save-address-checkbox">
               <input 
                 type="checkbox" 
                 id="saveAddr" 
                 checked={saveAddress} 
                 onChange={() => setSaveAddress(!saveAddress)} 
               />
               <label htmlFor="saveAddr">Save this address for future use</label>
            </div>
          </div>
        )}

        {!showNewAddressForm && selectedAddressIndex !== -1 && (
          <div className="selected-address-summary animate-fade-in">
             <p className="section-subtitle">Delivering to</p>
             <div className="delivery-summary-card">
                <p><b>{data.firstName} {data.lastName}</b></p>
                <p>{data.street}, {data.city}, {data.state} - {data.zipcode}</p>
                <p>Phone: {data.phone}</p>
             </div>
          </div>
        )}
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
          <div className="payment-methods-selection">
            <p className="payment-label">Supported Payment Apps</p>
            <div className="payment-icons-grid">
              {/* Google Pay - Realistic SVG */}
              <div className="pay-icon-item" title="Google Pay">
                <svg viewBox="0 0 40 16" width="45" height="18">
                  <path fill="#4285F4" d="M12.4 8c0 1.8-1.5 3.3-3.3 3.3S5.8 9.8 5.8 8s1.5-3.3 3.3-3.3S12.4 6.2 12.4 8zm-1 0c0-1.3-1-2.3-2.3-2.3S6.8 6.7 6.8 8s1 2.3 2.3 2.3S11.4 9.3 11.4 8z" />
                  <path fill="#34A853" d="M22.5 8c0 1.8-1.5 3.3-3.3 3.3s-3.3-1.5-3.3-3.3 1.5-3.3 3.3-3.3 3.3 1.5 3.3 3.3zm-1 0c0-1.3-1-2.3-2.3-2.3s-2.3 1-2.3 2.3 1 2.3 2.3 2.3 2.3-1 2.3-2.3z" />
                  <path fill="#FBBC05" d="M30 11.1c-1.8 0-3.3-1.5-3.3-3.3s1.5-3.3 3.3-3.3c.9 0 1.6.3 2.2.9l-.7.7c-.4-.4-.9-.6-1.5-.6-1.3 0-2.3 1-2.3 2.3s1 2.3 2.3 2.3c.7 0 1.2-.3 1.6-.7.4-.4.7-1 .8-1.8H30V8.2h3.9c.1.2.1.4.1.7 0 1.1-.3 2.1-1 2.8-.7.7-1.7 1.1-3 1.1z" />
                  <path fill="#EA4335" d="M3.5 8.2h7.3c.1-.4.2-.8.2-1.2 0-2.2-1.8-4-4-4s-4 1.8-4 4c0 .4.1.8.2 1.2z" />
                </svg>
              </div>
              {/* PhonePe - Realistic SVG */}
              <div className="pay-icon-item" title="PhonePe">
                <svg viewBox="0 0 100 100" width="30" height="30">
                  <rect width="100" height="100" rx="20" fill="#6739B7" />
                  <path d="M30 70V30h15c10 0 15 5 15 12s-5 12-15 12H30M45 54c5 0 8-3 8-7s-3-7-8-7h-8v14h8z" fill="white" />
                  <circle cx="75" cy="75" r="10" fill="white" />
                </svg>
              </div>
              {/* Paytm - Realistic SVG */}
              <div className="pay-icon-item" title="Paytm">
                <svg viewBox="0 0 100 40" width="50" height="20">
                  <text x="0" y="30" fill="#00B9F1" style={{fontFamily: 'Outfit, sans-serif', fontWeight: '900', fontSize: '32px'}}>pay</text>
                  <text x="55" y="30" fill="#002E6E" style={{fontFamily: 'Outfit, sans-serif', fontWeight: '900', fontSize: '32px'}}>tm</text>
                </svg>
              </div>
              {/* UPI - Realistic SVG */}
              <div className="pay-icon-item" title="UPI">
                <svg viewBox="0 0 100 100" width="30" height="30">
                  <path d="M10 50L50 10L90 50L50 90z" fill="#F48221" />
                  <path d="M15 55L55 15L95 55L55 95z" fill="#097939" opacity="0.8" />
                  <text x="25" y="60" fill="white" style={{fontSize: '20px', fontWeight: 'bold'}}>UPI</text>
                </svg>
              </div>
            </div>
          </div>
          <button type="submit" className="payment-btn">PROCEED TO PAYMENT</button>
          <p className="payment-note">🔒 Secured by Stripe. All major UPI apps & cards supported.</p>
        </div>
      </div>
    </form>
  );
}

export default PlaceOrder;
