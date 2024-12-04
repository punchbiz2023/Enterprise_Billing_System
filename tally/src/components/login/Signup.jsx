import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields (optional)
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    const formDataToSend = new FormData();

    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const response = await axios.post('https://enterprisebillingsystem.onrender.com/api/sign-up', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.status === 201) {
        alert('User registered successfully!');
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.message === "Request failed with status code 500") {
        alert("Mail already Exists Try logging in")
      }
      else {
        console.error('Error:', error);
        alert('Failed to register user. Please try again.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-2xl p-8 bg-white border border-gray-300 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Sign Up</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Company Name', name: 'companyName', type: 'text' },
            { label: 'Company Email', name: 'companyEmail', type: 'email' },
            { label: 'Password', name: 'password', type: 'password' },
            { label: 'Confirm Password', name: 'confirmPassword', type: 'password' },
            { label: 'Address', name: 'address', type: 'text' },
            { label: 'Phone Number', name: 'phoneNumber', type: 'tel' },
            { label: 'GST Number', name: 'gstNumber', type: 'text' },
            { label: 'PAN Number', name: 'panNumber', type: 'text' },
          ].map((field) => (
            <div key={field.name} className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                className="w-full px-4 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded"
                placeholder={`Enter ${field.label.toLowerCase()}`}
                value={formData[field.name]}
                onChange={handleChange}
                required
              />
            </div>
          ))}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Upload Documents</label>
            <input
              type="file"
              name="documents"
              className="w-full px-4 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mt-6">
            <button
              type="submit"
              className="w-full py-3 text-white bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
