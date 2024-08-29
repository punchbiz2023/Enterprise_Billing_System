import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Signup.css';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    companyEmail: '',
    password: '',
    confirmPassword: '',
    address: '',
    phoneNumber: '',
    documents: null,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'file' ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();


    if (!formData.companyName || !formData.companyEmail || !formData.password || !formData.confirmPassword || !formData.address || !formData.phoneNumber || !formData.documents) {
      toast.error("All fields are required!", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }


    toast.success("Company created successfully!", {
      position: toast.POSITION.TOP_CENTER,
    });


    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className='page-container'>
      <div className="signup-container">
        <ToastContainer />
        <h1 className='pb-8 text-black font-bold'>Sign Up</h1>
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="input-container">
            <label>Company Name</label>
            <input
              type="text"
              className="input-box"
              name="companyName"
              placeholder="Enter company name"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-container">
            <label>Company Email</label>
            <input
              type="email"
              className="input-box"
              name="companyEmail"
              placeholder="Enter company email"
              value={formData.companyEmail}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-container">
            <label>Password</label>
            <input
              type="password"
              className="input-box"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-container">
            <label>Confirm Password</label>
            <input
              type="password"
              className="input-box"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-container">
            <label>Address</label>
            <input
              type="text"
              className="input-box"
              name="address"
              placeholder="Enter address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-container">
            <label>Phone Number</label>
            <input
              type="tel"
              className="input-box"
              name="phoneNumber"
              placeholder="Enter phone number"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-container">
            <label>GST Number</label>
            <input
              type="tel"
              className="input-box"
              name="gstNumber"
              placeholder="Enter GST number"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-container">
            <label>PAN Number</label>
            <input
              type="tel"
              className="input-box"
              name="panNumber"
              placeholder="Enter PAN number"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-container">
            <label>Upload Documents</label>
            <input
              type="file"
              name="documents"
              onChange={handleChange}
              required
            />
          </div>

        </form>
        <div className="signup-button-container">
          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </div>

      </div>
    </div>
  );
};

export default SignUp;
