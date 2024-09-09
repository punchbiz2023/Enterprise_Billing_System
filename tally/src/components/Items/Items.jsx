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
  const [selectedType, setSelectedType] = useState(null);
  const [clickCount, setClickCount] = useState(0);

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

  const handleTypeClick = () => {
    const uniqueTypes = Array.from(new Set(items.map(item => item.type)));
    const currentIndex = uniqueTypes.indexOf(selectedType);
    const nextIndex = (currentIndex + 1) % (uniqueTypes.length + 1);
    const newType = nextIndex < uniqueTypes.length ? uniqueTypes[nextIndex] : null;

    setSelectedType(newType);
    setClickCount(prev => prev + 1);
  };

  const filteredItems = selectedType
    ? items.filter(item => item.type === selectedType)
    : items;

  return (
    <div className="flex">
      <div className="w-1/5">
        <Navbar />
      </div>
      <div className="w-4/5 p-6 mt-[4%] mr-[10%]">
        <h1 className="text-xl font-bold mb-4">Items</h1>

        <div className="flex justify-between mb-4">
          <Link
            to="/dashboard/items/form"
            className="inline-block px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Item
          </Link>
          <div className="flex space-x-4">
            {selectedItems.length > 0 && (
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
                <th className="py-2 px-4 border-b text-center"></th>
                <th className="py-2 px-4 border-b text-center">Name</th>
                <th className="py-2 px-4 border-b text-center">Rate</th>
                <th
                  className="py-2 px-4 border-b cursor-pointer text-center"
                  onClick={handleTypeClick}
                >
                  Type
                </th>
                <th className="py-2 px-4 border-b text-center">Unit</th>
                <th className="py-2 px-4 border-b text-center">Description</th>
              </tr>
            </thead>
            <tbody>
              {!dataLoaded ? (
                <tr>
                  <td colSpan="6" className="py-2 px-4 text-center text-gray-500">
                    Loading Items...
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-2 px-4 text-center text-gray-500">
                    No Items found
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, index) => (
                  <tr key={item.id || index} className="hover:bg-gray-100">
                    <td className="py-2 px-2 border-b text-center">
                      {showCheckboxes && <input
                        type="checkbox"
                        className="form-checkbox"
                        onChange={() => handleCheckboxChange(item.sno)}
                        checked={selectedItems.includes(item.sno)}
                      />}
                    </td>
                    <td className="py-2  border-b text-center">{item.name}</td>
                    <td className="py-2 px-6 border-b text-center">{item.rate}</td>
                    <td className="py-2 px-6 border-b text-center">{item.type}</td>
                    <td className="py-2 px-6 border-b text-center">{item.unit}</td>
                    <td className="py-2 px-12 border-b text-center">{item.description}</td>
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
