import React, { useContext, useEffect, useState } from 'react';
import './Profile.css';
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';
import { messaging, getToken } from '../../config/firebase';

const Profile = () => {
  const { url, token, userData, setUserData } = useContext(StoreContext);
  
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: ""
  });
  
  const [image, setImage] = useState(false);
  const [loading, setLoading] = useState(false);

  const enableNotifications = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        await navigator.serviceWorker.ready;
        const fcmToken = await getToken(messaging, { 
          vapidKey: "BB-3hzSp7qof1IbETD-yTRzLaNvwS_3U5HEfJINPZa5yihG5gpCyBP7_uV92JQjaqvvhtgVm11pDbd7gynFPeko",
          serviceWorkerRegistration: registration
        });
        if (fcmToken && token) {
          await axios.post(url + "/api/user/update-fcm-token", { fcmToken }, { headers: { token } });
          toast.success("Notifications Enabled Successfully! 🔔");
        }
      } else {
        toast.error("Permission denied. Please enable notifications in your browser settings.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error enabling notifications.");
    }
  };

  // Fetch directly from backend to always get latest data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      try {
        const response = await axios.post(`${url}/api/user/info`, {}, { headers: { token } });
        if (response.data.success) {
          setData({
            name: response.data.name || "",
            email: response.data.email || "",
            phone: response.data.phone || "",
            bio: response.data.bio || ""
          });
          // Update photo in userData context too
          if (response.data.photo) {
            setUserData(prev => ({ ...prev, photo: response.data.photo }));
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfile();
  }, [token]);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("bio", data.bio);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axios.post(`${url}/api/user/update`, formData, {
        headers: { token }
      });

      if (response.data.success) {
        setUserData({
          ...userData,
          name: response.data.data.name,
          email: response.data.data.email,
          phone: response.data.data.phone,
          bio: response.data.data.bio,
          photo: response.data.data.photo,
        });
        toast.success("Profile updated successfully!");
        setImage(false); // Reset selected image after successful upload
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating profile.");
    }
    setLoading(false);
  };

  return (
    <div className='profile-container'>
      <form onSubmit={onSubmitHandler} className='profile-form'>
        <h2>Edit Personal Details</h2>
        
        <div className="profile-img-upload">
          <label htmlFor="image">
            <img 
              src={image ? URL.createObjectURL(image) : (userData.photo ? (userData.photo.startsWith('http') ? userData.photo : `${url}/images/${userData.photo}`) : assets.profile_icon)} 
              alt="Profile" 
              className="preview-img" 
            />
          </label>
          <input 
            onChange={(e) => setImage(e.target.files[0])} 
            type="file" 
            id="image" 
            hidden 
            accept="image/*" 
          />
          <p>Click image to upload new photo</p>
        </div>

        <div className="profile-inputs">
          <div className="input-group">
            <label>Name</label>
            <input 
              type="text" 
              name="name" 
              value={data.name} 
              onChange={onChangeHandler} 
              placeholder="Your Name" 
              required 
            />
          </div>
          
          <div className="input-group">
            <label>Email</label>
            <input 
              type="email" 
              name="email" 
              value={data.email} 
              onChange={onChangeHandler} 
              placeholder="Your Email" 
              required 
            />
          </div>
          
          <div className="input-group">
            <label>Phone Number</label>
            <input 
              type="text" 
              name="phone" 
              value={data.phone} 
              onChange={onChangeHandler} 
              placeholder="Your Phone Number" 
            />
          </div>
          
          <div className="input-group">
            <label>Bio / About Me</label>
            <textarea 
              name="bio" 
              value={data.bio} 
              onChange={onChangeHandler} 
              placeholder="Tell us a little about yourself" 
              rows="4"
            ></textarea>
          </div>
        </div>

        <button type="submit" disabled={loading} className="save-btn">
          {loading ? "Saving..." : "Save Changes"}
        </button>

        <div className="notification-settings" style={{marginTop: '30px', padding: '20px', border: '1px dashed #ff4c24', borderRadius: '15px', textAlign: 'center'}}>
           <h3>Stay Updated! 🔔</h3>
           <p style={{fontSize: '13px', color: '#666', marginBottom: '15px'}}>Get real-time alerts about your orders and special offers.</p>
           <button 
             type="button" 
             onClick={enableNotifications} 
             className="enable-btn"
             style={{background: '#ff4c24', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '25px', cursor: 'pointer', fontWeight: '600'}}
           >
             Enable Phone Notifications
           </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
