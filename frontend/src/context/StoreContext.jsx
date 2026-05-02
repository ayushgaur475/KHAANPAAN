import { createContext, useEffect, useState } from "react";
export const StoreContext = createContext(null);
import axios from "axios";
import { food_list as local_food_list } from "../assets/assets";

const StoreContextProvider = (props) => {
  console.log("🚀 DEBUG: STORE CONTEXT LOADED - VERSION 2.0");
  const [cartItems, setCartItems] = useState({});
  const url = (import.meta.env.VITE_BACKEND_URL ? import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "") : 'http://localhost:4000');
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState(local_food_list);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [userData, setUserData] = useState({ name: "", coins: 0, email: "", phone: "", photo: "", bio: "" });

  const fetchUserData = async (token) => {
    const response = await axios.post(url + "/api/user/info", {}, { headers: { token } });
    if (response.data.success) {
      setUserData({ 
        name: response.data.name, 
        coins: response.data.coins,
        email: response.data.email || "",
        phone: response.data.phone || "",
        photo: response.data.photo || "",
        bio: response.data.bio || ""
      });
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

  useEffect( () => {
    async function loadData() {
      await fetchFoodList();
      if(localStorage.getItem("token")){
        setToken(localStorage.getItem("token"));
        await loadCartData(localStorage.getItem("token"));
        await fetchUserData(localStorage.getItem("token"));
      }
    }
    loadData();
  },[])

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
    fetchUserData
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
