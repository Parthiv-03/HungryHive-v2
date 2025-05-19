import React, { useState,useEffect } from 'react';
import './ProfilePage.css'; // Custom CSS for styling
import { useSelector,useDispatch } from 'react-redux';
import { setlogout,setuser } from '../../redux-toolkit/userSlice';
import axios from 'axios';

const ProfilePage = () => {
  const isloggedin = useSelector((state) => state.user.isLoggedin);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const [profile, setProfile] = useState({
    name: user.name,
    email: user.email,
    phone_number: user.phone_number || "",
    address: {
      house_no: (user.address && user.address.house_no) || "", 
      street: (user.address && user.address.street) || "",
      area: (user.address && user.address.area) || "",
      pincode: (user.address && user.address.pincode) || "",
      city: (user.address && user.address.city) || "",
      state: (user.address && user.address.state) || "",
      country: (user.address && user.address.country) || "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setProfile({
        ...profile,
        address: { ...profile.address, [addressField]: value },
      });
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`http://localhost:5000/api/users/update-user/${user._id}`,{
        profile: profile,
      });

      if(response.data.user){
        dispatch(setuser(response.data.user));
        console.log(response.data.user);
      }
      else{
        console.log(response.data.message);
      }
    } catch (err) {
      console.error('Error updating cart:', err);
    }

    alert('Profile Updated Successfully.');
  };

  const handleLogout = () => {
    dispatch(setlogout());
    console.log("logout");
  };

  return (
    isloggedin ? (
    <div className="profile-container">
      <div className="profile-box">
        <div className="header-row">
          <h2>Personal Info</h2>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
        <p>Customize your profile information.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="input-row">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={profile.name}
                onChange={handleChange}
              />
            </div>

            <div className="input-row">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
              />
            </div>

            <div className="input-row">
              <label htmlFor="phone_number">Phone Number</label>
              <input
                type="tel"
                id="phone_number"
                name="phone_number"
                value={profile.phone_number}
                onChange={handleChange}
                pattern="[1-9]{1}[0-9]{9}"
              />
            </div>
          </div>

          <fieldset className="address-fieldset">
            <legend>Address</legend>

            <div className="form-grid">
              <div className="input-row">
                <label htmlFor="house_no">House No.</label>
                <input
                  type="text"
                  id="house_no"
                  name="address.house_no"
                  value={profile.address.house_no}
                  onChange={handleChange}
                />
              </div>
              <div className="input-row">
                <label htmlFor="street">Street</label>
                <input
                  type="text"
                  id="street"
                  name="address.street"
                  value={profile.address.street}
                  onChange={handleChange}
                />
              </div>
              <div className="input-row">
                <label htmlFor="area">Area</label>
                <input
                  type="text"
                  id="area"
                  name="address.area"
                  value={profile.address.area}
                  onChange={handleChange}
                />
              </div>
              <div className="input-row">
                <label htmlFor="pincode">Pincode</label>
                <input
                  type="text"
                  id="pincode"
                  name="address.pincode"
                  value={profile.address.pincode}
                  onChange={handleChange}
                />
              </div>
              <div className="input-row">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="address.city"
                  value={profile.address.city}
                  onChange={handleChange}
                />
              </div>
              <div className="input-row">
                <label htmlFor="state">State</label>
                <input
                  type="text"
                  id="state"
                  name="address.state"
                  value={profile.address.state}
                  onChange={handleChange}
                />
              </div>
              <div className="input-row">
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  id="country"
                  name="address.country"
                  value={profile.address.country}
                  onChange={handleChange}
                />
              </div>
            </div>
          </fieldset>

          <div className="button-row">
            <button type="submit" className="save-button">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
    ) : (<h1></h1>)
  );
};

export default ProfilePage;