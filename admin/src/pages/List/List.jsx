import React, { useEffect, useState } from 'react'
import './List.css'
import axios from 'axios';
import { toast } from 'react-toastify';

// Fallback placeholder for broken/missing images
const PLACEHOLDER = 'https://via.placeholder.com/50x50/f3f4f6/aaa?text=🍽️';

function List({url, token}) {
  const [list, setList] = useState([]);
  const [loadedImages, setLoadedImages] = useState({});
  const fetchList = async() => {
    const response = await axios.get(`${url}/api/food/list`);
    console.log(response.data);
    if(response.data.success){
      setList(response.data.data);
    }
    else{
      toast.error('Error');
    }
  }

  const removeFood = async(foodId) => {
     const response = await axios.post(`${url}/api/food/remove`, {id: foodId}, {headers:{token}});
     await fetchList();
     if(response.data.success){
      toast.success(response.data.message)
     }
     else{
      toast.error("Error")
     }
  }
  const toggleStock = async(foodId) => {
    const response = await axios.post(`${url}/api/food/toggle-stock`, {id: foodId}, {headers:{token}});
    if(response.data.success){
      await fetchList();
      toast.success(response.data.message)
    } else {
      toast.error("Error updating stock status")
    }
  }

  useEffect(() => {
    fetchList();
  }, [])
  return (
    <div className='list-page'>
      <div className="list-container glass-card">
        <div className="list-header">
          <h2 className="page-title">All Products Inventory</h2>
          <p className="item-count">{list.length} items total</p>
        </div>
        
        <div className='list-table'>
          <div className='list-table-header'>
            <b>Image</b>
            <b>Name</b>
            <b>Category</b>
            <b>Price</b>
            <b>Stock</b>
            <b>Action</b>
          </div>
          
          <div className="list-items-scroll">
            {list.map((item, index) => {
              return (
                <div key={index} className='list-table-row'>
                  <div className="item-img-container">
                    {!loadedImages[item._id] && <div className="img-skeleton" />}
                    <img
                      src={typeof item.image === 'string' && item.image.startsWith('http') ? item.image : `${url}/images/` + item.image}
                      alt={item.name}
                      loading="lazy"
                      style={{ display: loadedImages[item._id] ? 'block' : 'none' }}
                      onLoad={() => setLoadedImages(prev => ({ ...prev, [item._id]: true }))}
                      onError={(e) => { e.target.src = PLACEHOLDER; setLoadedImages(prev => ({ ...prev, [item._id]: true })); }}
                    />
                  </div>
                  <p className="item-name">{item.name}</p>
                  <p className="item-category-badge">{item.category}</p>
                  <p className="item-price">₹{item.price}</p>
                  <div className="item-stock">
                    <button 
                      onClick={() => toggleStock(item._id)} 
                      className={`stock-btn ${item.inStock ? 'in-stock' : 'out-of-stock'}`}
                    >
                      {item.inStock ? "In Stock" : "Out of Stock"}
                    </button>
                  </div>
                  <div className="item-action">
                    <button onClick={() => removeFood(item._id)} className='remove-btn' title="Delete Product">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              )
            })}
            {list.length === 0 && (
              <div className="empty-state">No products found in inventory.</div>
            )}
          </div>
        </div>
      </div>
    </div>


  )
}

export default List
