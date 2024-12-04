import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { jwtDecode } from 'jwt-decode';
import './Items.css';

const Items = () => {
  const [items, setItems] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBy, setSearchBy] = useState('name'); // Default search by name
  const [loggedUser, setLoggedUser] = useState(null);


  useEffect(() => {
    if (loggedUser) {
      fetchItems(loggedUser);
    }
  }, [loggedUser]);
  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    const decoded = jwtDecode(token)
    
    setLoggedUser(decoded.email); 
  }, []);

  const fetchItems = async (loggedUser) => {
    try {
      const response = await axios.get('https://enterprisebillingsystem.onrender.com/api/items',{
        params:{loggedUser}
      });
      if (response.data) {
        setItems(response.data);
        setDataLoaded(true);
      }
    } catch (error) {
      console.error('Error fetching Item data:', error.response ? error.response.data : error.message);
    }
  };

  const handleCheckboxChange = (itemId) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(itemId)
        ? prevSelected.filter((id) => id !== itemId)
        : [...prevSelected, itemId]
    );
  };

  const handleDelete = async () => {
    if (selectedItems.length <= 0) return;

    try {
      await axios.delete('https://enterprisebillingsystem.onrender.com/api/items', { data: { ids: selectedItems } });
      fetchItems(loggedUser);
      setSelectedItems([]);
    } catch (error) {
      console.error('Error deleting Items:', error.response ? error.response.data : error.message);
    }
  };

  const handleCancelDelete = () => {
    setSelectedItems([]); // Unselect all items
    setShowCheckboxes(false); // Hide checkboxes
  };

  // Filter items based on searchQuery and searchBy criteria
  const filteredItems = items.filter((item) => {
    return item[searchBy]?.toLowerCase().startsWith(searchQuery.toLowerCase());
  });

  return (
    <div className="flex">
      <div className="w-1/5">
        <Navbar />
      </div>
      <div className="w-4/5 p-6 mt-[4%] mr-[10%]">
        <h1 className="text-xl font-bold mb-4">Items</h1>

        {/* Container for Search and Buttons */}
        <div className="flex justify-between items-center mb-4">
          {/* Search Section */}
          <div className="relative w-[400px]">
            <div className="flex border border-gray-400">
              <select
                value={searchBy}
                onChange={(e) => setSearchBy(e.target.value)}
                className="bg-gray-100 px-2 py-2 border border-gray-600 rounded-l text-gray-800 cursor-pointer focus:outline-none"
              >
                <option value="name">Name</option>
                <option value="itemcode">Item Code</option>
                <option value="type">Type</option>
              </select>
              <input
                type="text"
                placeholder={`Search by ${searchBy}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-100 flex-grow px-3 py-2 focus:outline-none"
              />
            </div>
          </div>

          {/* Buttons on the right side */}
          <div className="flex space-x-4">
            <Link
              to="/dashboard/items/form"
              className="inline-block px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Item
            </Link>

            {selectedItems.length > 0 && (
              <button
                onClick={handleDelete}
                className="inline-block px-5 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete Selected
              </button>
            )}

            <button
              onClick={() => {
                if (showCheckboxes) {
                  handleCancelDelete();
                } else {
                  setShowCheckboxes(true);
                }
              }}
              className={`inline-block px-5 py-2 rounded text-white ${showCheckboxes ? 'bg-gray-500 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'
                }`}
            >
              {showCheckboxes ? 'Cancel Delete' : 'Delete Items'}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border-b text-center"></th>
                <th className="py-2 px-4 border-b text-center">Item Code</th>
                <th className="py-2 px-4 border-b text-center">Name</th>
                <th className="py-2 px-4 border-b text-center">Type</th>
                <th className="py-2 px-4 border-b text-center">Selling Price</th>
                <th className="py-2 px-4 border-b text-center">Cost Price</th>
                <th className="py-2 px-4 border-b text-center">Unit</th>
                <th className="py-2 px-4 border-b text-center">Sales Description</th>
                <th className="py-2 px-4 border-b text-center">Purchase Description</th>
                <th className="py-2 px-4 border-b text-center">Quantity</th>           {/* Added Quantity Header */}
                <th className="py-2 px-4 border-b text-center">Opening Stock</th>      {/* Added Opening Stock Header */}
              </tr>
            </thead>
            <tbody>
              {!dataLoaded ? (
                <tr>
                  <td colSpan="11" className="py-2 px-4 text-center text-gray-500">
                    Loading Items...
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="11" className="py-2 px-4 text-center text-gray-500">
                    No Items found
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.sno} className="hover:bg-gray-100">
                    <td className="py-2 px-2 border-b text-center">
                      {showCheckboxes && (
                        <input
                          type="checkbox"
                          className="form-checkbox"
                          onChange={() => handleCheckboxChange(item.sno)}
                          checked={selectedItems.includes(item.sno)}
                        />
                      )}
                    </td>
                    <td className="py-2 px-4 border-b text-center">{item.itemcode}</td>
                    <td className="py-2 px-4 border-b text-center">
                      <Link to={`/items/${item.sno}`} className="text-blue-500 hover:underline">
                        {item.name}
                      </Link>
                    </td>
                    <td className="py-2 px-4 border-b text-center">{item.type}</td>
                    <td className="py-2 px-4 border-b text-center">{item.salesprice}</td>
                    <td className="py-2 px-4 border-b text-center">{item.costprice}</td>
                    <td className="py-2 px-4 border-b text-center">{item.unit}</td>
                    <td className="py-2 px-4 border-b text-center">{item.salesdescription}</td>
                    <td className="py-2 px-4 border-b text-center">{item.purchasedescription}</td>
                    <td className="py-2 px-4 border-b text-center">{item.quantity}</td>          {/* Added Quantity Data */}
                    <td className="py-2 px-4 border-b text-center">{item.openingstock}</td>      {/* Added Opening Stock Data */}
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
