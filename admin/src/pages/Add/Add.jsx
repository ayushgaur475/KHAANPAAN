import React, { useState } from 'react'
import './Add.css'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

function Add({url, token}) {

    const [image, setImage] = useState(false);
    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Salad",
        veg: true
    })
    const onChangeHandler = (event) => {
      const name = event.target.name;
      const value = event.target.value;
      setData(data => ({...data,[name]:value}))
    }

    const onSubmitHandler = async(event)=> {
       event.preventDefault();
       const formData = new FormData();
       formData.append("name", data.name)
       formData.append("description", data.description)
       formData.append("price", Number(data.price))
       formData.append("category", data.category)
       formData.append("veg", data.veg)
       formData.append("image", image)
       const response = await axios.post(`${url}/api/food/add`, formData, {headers:{token}})
       if(response.data.success){
          setData({
            name: "",
            description: "",
            price: "",
            category: "Salad",
            veg: true
          })
          setImage(false)
          toast.success(response.data.message)
       }
       else{
          toast.error(response.data.message)
       }
    }
  return (
    <div className='add'>
      <div className="add-container glass-card">
        <h2 className="page-title">Add New Product</h2>
        <form className='flex-col' onSubmit={onSubmitHandler}>
            <div className='add-img-upload flex-col'>
              <p className="label-text">🖼️ Upload Product Image</p>
              <label htmlFor='image' className="upload-label">
                  <div className={`upload-placeholder ${image ? 'has-image' : ''}`}>
                    <img className="image" src={image ? URL.createObjectURL(image) : assets.upload_area} alt=''></img>
                    {!image && <div className="upload-hint">Drag & Drop or Click to Upload</div>}
                  </div>
              </label>
              <input onChange={(e) => setImage(e.target.files[0])} type='file' id="image" hidden required></input>
            </div>
            <div className='add-product-name flex-col'>
              <p className="label-text">🏷️ Product Name</p>
              <input className="input-field" onChange={onChangeHandler} value={data.name} type='text' name='name' placeholder='e.g. Classic Greek Salad' required></input>
            </div>
            <div className='add-product-description flex-col'>
              <p className="label-text">📝 Product Description</p>
              <textarea className="input-field" onChange={onChangeHandler} value={data.description} name='description' rows="4" placeholder='Describe the delicious details...' required></textarea>
            </div>
            <div className='add-category-price'>
              <div className='add-category flex-col'>
                  <p className="label-text">🍱 Category</p>
                  <select className="input-field select-field" onChange={onChangeHandler} name='category'>
                      <option value="Salad">Salad</option>
                      <option value="Rolls">Rolls</option>
                      <option value="Deserts">Deserts</option>
                      <option value="Sandwich">Sandwich</option>
                      <option value="Cake">Cake</option>
                      <option value="Pure Veg">Pure Veg</option>
                      <option value="Pasta">Pasta</option>
                      <option value="Noodles">Noodles</option>
                      <option value="Indian">Indian</option>
                      <option value="Biryani">Biryani</option>
                      <option value="Pizza">Pizza</option>
                      <option value="Burger">Burger</option>
                      <option value="Beverages">Beverages</option>
                      <option value="Bread">Bread</option>
                   </select>
              </div>
              <div className='add-dietary flex-col'>
                  <p className="label-text">🍃 Dietary</p>
                  <select className="input-field select-field" onChange={(e) => setData(d => ({...d, veg: e.target.value === "true"}))} name='veg'>
                      <option value="true">Veg</option>
                      <option value="false">Non-Veg</option>
                  </select>
              </div>
              <div className='add-price flex-col'>
                  <p className="label-text">💰 Price (₹)</p>
                  <input className='input-field' onChange={onChangeHandler} value={data.price} type='Number' name='price' placeholder='20' required></input>
              </div>
            </div>
            <button type='submit' className='btn-premium add-btn'>🚀 ADD TO MENU</button>
        </form>
      </div>
    </div>

  )
}

export default Add
