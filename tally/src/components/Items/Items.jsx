import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import './items.css';

const Items = () => {
  const [items, setItems] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showCheckboxes, setShowCheckboxes] = useState(false);

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
      fetchItems(); // Refresh the items list after deletion
      setSelectedItems([]); // Clear selected items
      setShowCheckboxes(false); // Hide checkboxes after deletion
    } catch (error) {
      console.error('Error deleting Items:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="flex ml-20">
      <Navbar />
      <div className="w-3/4 p-6 mt-[5%] ml-[10%]">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Items</h1>
          <div className="flex space-x-4">
            <Link
              to="/dashboard/items/form"
              className="inline-block px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Item
            </Link>
            {showCheckboxes && selectedItems.length > 0 && (
              <button
                onClick={handleDelete}
                className="inline-block px-5 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete Selected
              </button>
            )}
            <button
              onClick={() => setShowCheckboxes(!showCheckboxes)}
              className={`inline-block px-5 py-2 rounded text-white ${showCheckboxes ? 'bg-gray-500 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'}`}
            >
              {showCheckboxes ? 'Cancel Delete' : 'Delete Items'}
            </button>
          </div>
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
                      {showCheckboxes && (
                        <input
                          type="checkbox"
                          className="form-checkbox"
                          onChange={() => handleCheckboxChange(item.sno)}
                          checked={selectedItems.includes(item.sno)}
                        />
                      )}
                    </td>
                    <td className="py-2 px-4 text-center border-b">{item.name}</td>
                    <td className="py-2 px-4 text-center border-b">{item.rate}</td>
                    <td className="py-2 px-4 text-center border-b">{item.type}</td>
                    <td className="py-2 px-4 text-center border-b">{item.unit}</td>
                    <td className="py-2 px-4 text-center border-b">{item.description}</td>
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
