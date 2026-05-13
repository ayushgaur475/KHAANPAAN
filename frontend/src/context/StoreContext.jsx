import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { food_list as local_food_list } from "../assets/assets";
import { messaging, getToken, onMessage } from "../config/firebase";
import { toast } from 'react-toastify';

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  console.log("🚀 DEBUG: STORE CONTEXT LOADED - VERSION 2.1 - NOTIFICATIONS READY");
  const [cartItems, setCartItems] = useState({});
  const url = (import.meta.env.VITE_BACKEND_URL ? import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "") : 'http://localhost:4000');
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState(local_food_list);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [userData, setUserData] = useState({ name: "", coins: 0, email: "", phone: "", photo: "", bio: "", isFirstOrder: true, addresses: [] });
  const [appliedPromo, setAppliedPromo] = useState(null);

  const requestNotificationPermission = async (userToken) => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        await navigator.serviceWorker.ready;
        const fcmToken = await getToken(messaging, { 
          vapidKey: "BB-3hzSp7qof1IbETD-yTRzLaNvwS_3U5HEfJINPZa5yihG5gpCyBP7_uV92JQjaqvvhtgVm11pDbd7gynFPeko"
        });
        
        if (fcmToken) {
          console.log("✅ FCM Token Synced:", fcmToken);
          // Send to backend (it handles both userToken and guest logic)
          await axios.post(url + "/api/user/update-fcm-token", { fcmToken, userId: userToken ? null : undefined }, { headers: { token: userToken || "" } });
        }
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    }
  };

  const fetchUserData = async (token) => {
    const response = await axios.post(url + "/api/user/info", {}, { headers: { token } });
    if (response.data.success) {
      setUserData({ 
        name: response.data.name, 
        coins: response.data.coins,
        email: response.data.email || "",
        phone: response.data.phone || "",
        photo: response.data.photo || "",
        bio: response.data.bio || "",
        isFirstOrder: response.data.isFirstOrder,
        addresses: response.data.addresses || []
      });
      // Request notification permission after user data is loaded
      requestNotificationPermission(token);
    }
  }

  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
    if(token){
      await axios.post(url+"/api/cart/add", {itemId}, {headers: {token}})
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if(token){
      await axios.post(url+"/api/cart/remove",{itemId}, {headers:{token}});
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  }

  const fetchFoodList = async () => {
    const response = await axios.get(url+"/api/food/list");
    if (response.data.success && response.data.data.length > 0) {
      setFoodList(response.data.data)
    }
  }
   
  const loadCartData = async(token) => {
    const response = await axios.post(url+"/api/cart/get", {}, {headers: {token}});
    setCartItems(response.data.cartData || {});
  }

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      if(localStorage.getItem("token")){
        const savedToken = localStorage.getItem("token");
        setToken(savedToken);
        await loadCartData(savedToken);
        await fetchUserData(savedToken);
        // Sync for logged-in user
        requestNotificationPermission(savedToken);
      } else {
        // Sync for guest/new user even if not logged in
        requestNotificationPermission(null);
      }
    }
    loadData();

    // Listen for foreground notifications
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("🔥 Foreground Message:", payload);
      const iconUrl = payload.data?.icon || payload.notification?.icon || '/logo192.png';
      
      toast.info(`${payload.notification.title}: ${payload.notification.body}`, {
        icon: () => <img src={iconUrl} style={{ width: '25px', borderRadius: '4px' }} alt="" />,
        position: "top-center",
        autoClose: 5000
      });
    });

    return () => unsubscribe();
  }, [])

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    userData,
    setUserData,
    fetchUserData,
    appliedPromo,
    setAppliedPromo,
    requestNotificationPermission
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
