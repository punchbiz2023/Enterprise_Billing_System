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
    gstNumber: '',
    panNumber: '',
    documents: null,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'file' ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.companyName || !formData.companyEmail || !formData.password || !formData.confirmPassword || !formData.address || !formData.phoneNumber || !formData.gstNumber || !formData.panNumber || !formData.documents) {
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
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-2xl p-8 bg-white border border-gray-300 rounded-lg shadow-md">
        <ToastContainer />
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Sign Up</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Company Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded"
              name="companyName"
              placeholder="Enter company name"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Company Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded"
              name="companyEmail"
              placeholder="Enter company email"
              value={formData.companyEmail}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              className="w-full px-4 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded"
              name="address"
              placeholder="Enter address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              className="w-full px-4 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded"
              name="phoneNumber"
              placeholder="Enter phone number"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">GST Number</label>
            <input
              type="text"
              className="w-full px-4 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded"
              name="gstNumber"
              placeholder="Enter GST number"
              value={formData.gstNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">PAN Number</label>
            <input
              type="text"
              className="w-full px-4 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded"
              name="panNumber"
              placeholder="Enter PAN number"
              value={formData.panNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Upload Documents</label>
            <input
              type="file"
              className="w-full px-4 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded"
              name="documents"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mt-6">
            <button type="submit" className="w-full py-3 text-white bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none">
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
