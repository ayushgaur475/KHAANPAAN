import React, { useEffect, useState } from 'react';
import './Profile.css';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const Profile = ({ url, token, setAdminPhoto }) => {
  const [name, setName] = useState('');
  const [image, setImage] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchAdminInfo = async () => {
    try {
      const response = await axios.post(`${url}/api/user/info`, {}, { headers: { token } });
      if (response.data.success) {
        setName(response.data.name || '');
        setCurrentPhoto(response.data.photo || '');
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (token) fetchAdminInfo();
  }, [token]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    if (image) formData.append('image', image);

    try {
      const response = await axios.post(`${url}/api/user/update`, formData, {
        headers: { token }
      });
      if (response.data.success) {
        toast.success('Profile updated successfully!');
        const newPhoto = response.data.data.photo || currentPhoto;
        setCurrentPhoto(newPhoto);
        if (setAdminPhoto) setAdminPhoto(newPhoto); // update Navbar instantly
        setImage(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Error updating profile.');
    }
    setLoading(false);
  };

  const photoSrc = image
    ? URL.createObjectURL(image)
    : currentPhoto
    ? `${url}/images/${currentPhoto}`
    : assets.profile_image;

  return (
    <div className='admin-profile-page'>
      <div className='admin-profile-card glass-card'>
        <h2>Admin Profile</h2>
        <p className='subtitle'>Update your display name and profile photo</p>

        <form onSubmit={onSubmitHandler} className='admin-profile-form'>
          <div className='photo-upload-section'>
            <label htmlFor='admin-photo-upload' className='photo-label'>
              <img src={photoSrc} alt='Admin' className='profile-preview' />
              <div className='photo-overlay'>
                <span>📷 Change Photo</span>
              </div>
            </label>
            <input
              id='admin-photo-upload'
              type='file'
              accept='image/*'
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
            <p className='photo-hint'>Click to upload a new photo</p>
          </div>

          <div className='name-section'>
            <label>Display Name</label>
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Your admin name'
              required
            />
          </div>

          <button type='submit' className='btn-premium save-btn' disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
