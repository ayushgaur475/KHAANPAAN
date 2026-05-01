import React, { useContext } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext';

function FoodItem({id, name, price, description, image, veg, inStock = true, setShowLogin}) {
  const {cartItems, addToCart, removeFromCart, url, token} = useContext(StoreContext);

  const handleAddToCart = () => {
    if (!token) {
      setShowLogin(true);
      return;
    }
    addToCart(id);
  };

  // Smart check: If name contains "Chicken", it's Non-Veg regardless of database value
  const isActuallyVeg = name.toLowerCase().includes("chicken") ? false : veg;

  return (
    <div className={`food-item ${!inStock ? 'out-of-stock-item' : ''}`}>
      <div className='food-item-img-container'>
      <img className='food-item-image' src={typeof image === 'string' ? url+"/images/"+image : image} alt = ""></img>
      {!inStock && <div className="out-of-stock-overlay">SOLD OUT</div>}
      {inStock && (
        !cartItems || !cartItems[id]
          ? <img className='add' onClick={handleAddToCart} src={assets.add_icon_white} alt="Add to cart" />
          : <div className='food-item-counter'>
              <img className='counter-btn' onClick={() => removeFromCart(id)} src={assets.remove_icon_red} alt="Remove" />
              <p className='cart-count'>{cartItems[id]}</p>
              <img className='counter-btn' onClick={() => addToCart(id)} src={assets.add_icon_green} alt="Add" />
            </div>
      )}
      </div>
      <div className='food-item-info'>
      <div className='food-item-name-rating'>
      <div className='name-indicator-container'>
        <div className={`dietary-indicator ${isActuallyVeg ? "veg" : "non-veg"}`}></div>
        <p className='namewe'>{name}</p>
      </div>
      <img className='ratingstars' src={assets.rating_starts}></img>
      </div>
      <p className='food-item-desc'>{description}</p>
      <p className='food-item-price'>₹{price}</p>
      </div>
    </div>
  )
}

export default FoodItem
