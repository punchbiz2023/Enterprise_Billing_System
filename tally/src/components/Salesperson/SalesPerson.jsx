import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const SalesPerson = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate



  const [loggedUser, setLoggedUser] = useState(null);




  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    const decoded = jwtDecode(token)
    setLoggedUser(decoded.email); 
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ name, email });

    try {
      if (editId) {
        // Update existing salesperson
        await axios.put(`https://enterprisebillingsystem.onrender.com/api/salespersons/${editId}`, { name, email, loggedUser });
      } else {
        // Create new salesperson
        await axios.post('https://enterprisebillingsystem.onrender.com/api/salespersons', { name, email, loggedUser });
      }
      setName('');
      setEmail('');
      setEditId(null);
      navigate(-1);
    } catch (error) {
      console.error('Error submitting salesperson:', error);
    }
  };


  const handleDelete = async () => {
    if (editId) {
      try {
        await axios.delete(`https://enterprisebillingsystem.onrender.com/api/salespersons/${editId}`);
        setName('');
        setEmail('');
        setEditId(null);
        navigate(-1);
      } catch (error) {
        console.error('Error deleting salesperson:', error);
      }
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-6 bg-white rounded-lg shadow-lg w-[300px] max-w-full"
      >
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-800">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full pt-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter your name"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-800 pt-5">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full pt-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter your email"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
        >
          {editId ? 'Update' : 'Submit'}
        </button>
        {editId && (
          <button
            type="button"
            onClick={handleDelete}
            className="w-full px-4 py-2 bg-red-500 text-white rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200 mt-2"
          >
            Delete
          </button>
        )}
      </form>
    </div>
  );
};

export default SalesPerson;
