import React, { useEffect, useState } from 'react'
import './List.css'
import axios from 'axios';
import { toast } from 'react-toastify';

const PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2250%22 height=%2250%22%3E%3Crect width=%2250%22 height=%2250%22 fill=%22%23f3f4f6%22/%3E%3C/svg%3E';

function List({url, token}) {
  const [list, setList] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [newImage, setNewImage] = useState(false);

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

  const handleEdit = (item) => {
    setEditData({
      id: item._id,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      veg: item.veg,
      image: item.image
    });
    setNewImage(false);
    setShowEdit(true);
  }

  const onEditChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setEditData(prev => ({ ...prev, [name]: value }));
  }

  const onUpdateHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("id", editData.id);
    formData.append("name", editData.name);
    formData.append("description", editData.description);
    formData.append("price", Number(editData.price));
    formData.append("category", editData.category);
    formData.append("veg", editData.veg);
    if (newImage) {
      formData.append("image", newImage);
    }

    try {
      const response = await axios.post(`${url}/api/food/update`, formData, { headers: { token } });
      if (response.data.success) {
        toast.success(response.data.message);
        setShowEdit(false);
        fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error updating product");
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
            <b>Dietary</b>
            <b>Price</b>
            <b>Stock</b>
            <b>Action</b>
          </div>
          
          <div className="list-items-scroll">
            {list.map((item, index) => {
              return (
                <div key={index} className='list-table-row'>
                  <div className="item-img-container">
                    <img
                      src={
                        typeof item.image === 'string' && (item.image.startsWith('http') || item.image.startsWith('/src/assets') || item.image.startsWith('data:')) 
                        ? item.image 
                        : url + "/images/" + item.image
                      }
                      alt={item.name}
                      className="food-img"
                      onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER; }}
                    />
                  </div>
                  <p className="item-name">{item.name}</p>
                  <div className="item-category-cell">
                    <span className={`category-badge ${item.category.toLowerCase().replace(/\s+/g, '-')}`}>
                      {item.category}
                    </span>
                  </div>
                  <p className={`item-dietary-badge ${item.veg ? 'veg' : 'non-veg'}`}>
                    {item.veg ? "🟢 Veg" : "🔴 Non-Veg"}
                  </p>
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
                    <button onClick={() => handleEdit(item)} className='edit-btn' title="Edit Product">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
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

      {/* Edit Product Modal */}
      {showEdit && (
        <div className="edit-modal-overlay">
          <div className="edit-modal glass-card">
            <div className="modal-header">
              <h3>Edit Product</h3>
              <button onClick={() => setShowEdit(false)} className="close-btn">&times;</button>
            </div>
            <form onSubmit={onUpdateHandler} className="edit-form">
              <div className="edit-img-section">
                <label htmlFor="new-image">
                  <img src={newImage ? URL.createObjectURL(newImage) : (editData.image.startsWith('http') ? editData.image : url + "/images/" + editData.image)} alt="Preview" />
                  <div className="img-edit-hint">Change Image</div>
                </label>
                <input type="file" id="new-image" hidden onChange={(e) => setNewImage(e.target.files[0])} />
              </div>
              
              <div className="edit-input-group">
                <label>Product Name</label>
                <input type="text" name="name" value={editData.name} onChange={onEditChangeHandler} required />
              </div>

              <div className="edit-input-group">
                <label>Description</label>
                <textarea name="description" value={editData.description} onChange={onEditChangeHandler} rows="3" required></textarea>
              </div>

              <div className="edit-row">
                <div className="edit-input-group">
                  <label>Category</label>
                  <select name="category" value={editData.category} onChange={onEditChangeHandler}>
                    <option value="Salad">Salad</option>
                    <option value="Rolls">Rolls</option>
                    <option value="Deserts">Deserts</option>
                    <option value="Sandwich">Sandwich</option>
                    <option value="Cake">Cake</option>
                    <option value="Pure Veg">Pure Veg</option>
                    <option value="Pasta">Pasta</option>
                    <option value="Noodles">Noodles</option>
                    <option value="Indian">Indian</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Bread">Bread</option>
                  </select>
                </div>
                <div className="edit-input-group">
                  <label>Price (₹)</label>
                  <input type="number" name="price" value={editData.price} onChange={onEditChangeHandler} required />
                </div>
              </div>

              <div className="edit-input-group">
                <label>Dietary</label>
                <select name="veg" value={editData.veg} onChange={(e) => setEditData(prev => ({...prev, veg: e.target.value === "true"}))}>
                  <option value="true">Vegetarian</option>
                  <option value="false">Non-Vegetarian</option>
                </select>
              </div>

              <button type="submit" className="btn-premium update-btn">Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default List
