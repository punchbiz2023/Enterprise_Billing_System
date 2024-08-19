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

    // Form validation
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

    // Show success notification
    toast.success("Company created successfully!", {
      position: toast.POSITION.TOP_CENTER,
    });

    // Redirect to Dashboard after a delay
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000); // Delay of 2 seconds before redirecting
  };

  return (
    <div className="signup-container">
      <ToastContainer />
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label>Company Name</label>
          <input
            type="text"
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
            name="phoneNumber"
            placeholder="Enter phone number"
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
        <button type="submit" className="signup-button">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
