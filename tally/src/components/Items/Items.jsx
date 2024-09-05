import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import './items.css';

const Items = () => {
  const [items, setItems] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);
  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/items');
      if (response.data) {
        setItems(response.data);
        setDataLoaded(true);
      }
    } catch (error) {
      console.error('Error fetching Item data:', error.response ? error.response.data : error.message);
    }
  };


  const handleCheckboxChange = (itemId) => {
    setSelectedItems(prevSelected =>
      prevSelected.includes(itemId)
        ? prevSelected.filter(id => id !== itemId)
        : [...prevSelected, itemId]
    );
  };

  const handleDelete = async () => {
    if (selectedItems.length <= 0) return;

    try {
      await axios.delete('http://localhost:3001/api/items', { data: { ids: selectedItems } });
      fetchItems();
      setSelectedItems([]);
    } catch (error) {
      console.error('Error deleting Items:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className='flex ml-20'>
      <Navbar />
      <div className="w-4/5 p-6  mt-16">
        <h1 className="text-xl font-bold mb-4">Items</h1>

        <div className="flex mb-4">
          <Link
            to="/dashboard/items/form"
            className="inline-block px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ml-40 mt-6"
          >
            Add Item
          </Link>
          {selectedItems.length > 0 && (
            <button
              onClick={handleDelete}
              className="inline-block w-40 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete Selected
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border-b"></th>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Rate</th>
                <th className="py-2 px-4 border-b">Type</th>
                <th className="py-2 px-4 border-b">Unit</th>
                <th className="py-2 px-4 border-b">Description</th>
                
              </tr>
            </thead>
            <tbody>
              {!dataLoaded ? (
                <tr>
                  <td colSpan="7" className="py-2 px-4 text-center text-gray-500">
                    Loading Items...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-2 px-4 text-center text-gray-500">
                    No Items found
                  </td>
                </tr>
              ) : (
                items.map((item, index) => (
                  <tr key={item.id || index} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        onChange={() => handleCheckboxChange(item.sno)}
                        checked={selectedItems.includes(item.sno)}
                      />
                    </td>

                    <td className="py-2 px-4 border-b">{item.name}</td>
                    <td className="py-2 px-4 border-b">{item.rate}</td>
                    <td className="py-2 px-4 border-b">{item.type}</td>
                    <td className="py-2 px-4 border-b">{item.unit}</td>
                    <td className="py-2 px-4 border-b">{item.description}</td>
                    
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Items;
