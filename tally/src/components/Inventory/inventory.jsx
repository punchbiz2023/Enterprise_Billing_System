import React, { useState } from 'react';
import axios from 'axios';

const Inventory = () => {
  // State for multiple rows (items)
  const [items, setItems] = useState([
    { itemName: '', hsnCode: '', quantity: '', rate: '', gst: '' }
  ]);

  // Handle input change for individual rows
  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...items];
    newItems[index][name] = value;
    setItems(newItems);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log(items); // Log the items to see if itemName and other fields are populated
  
    try {
      // Send data to the backend
      const response = await axios.post('http://localhost:3001/api/inventory', { items });
  
      if (response.status === 201) {
        console.log('Items stored successfully!', response.data);
        alert('Items stored successfully!');
      } else {
        console.error('Error storing items:', response.data);
      }
    } catch (error) {
      console.error('Error storing items:', error);
      alert('Error storing items!');
    }
  
    // Reset form after submission
    setItems([{ itemName: '', hsnCode: '', quantity: '', rate: '', gst: '' }]);
  };
  

  // Add a new row
  const addRow = () => {
    setItems([...items, { itemName: '', hsnCode: '', quantity: '', rate: '', gst: '' }]);
  };

  // Remove a row
  const deleteRow = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mt-20">Inventory Management</h2>

      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-gray-600 font-medium">Item Name</th>
              <th className="px-4 py-2 text-left text-gray-600 font-medium">HSN Code</th>
              <th className="px-4 py-2 text-left text-gray-600 font-medium">Quantity</th>
              <th className="px-4 py-2 text-left text-gray-600 font-medium">Rate</th>
              <th className="px-4 py-2 text-left text-gray-600 font-medium">GST%</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr className="border-b" key={index}>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    name="itemName"
                    value={item.itemName}
                    onChange={(e) => handleChange(index, e)}
                    placeholder="Enter item name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    name="hsnCode"
                    value={item.hsnCode}
                    onChange={(e) => handleChange(index, e)}
                    placeholder="Enter HSN code"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    name="quantity"
                    value={item.quantity}
                    onChange={(e) => handleChange(index, e)}
                    placeholder="Enter quantity"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    name="rate"
                    value={item.rate}
                    onChange={(e) => handleChange(index, e)}
                    placeholder="Enter rate"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    name="gst"
                    value={item.gst}
                    onChange={(e) => handleChange(index, e)}
                    placeholder="Enter GST%"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </td>
                <td className="px-4 py-2">
                  <button
                    type="button"
                    onClick={() => deleteRow(index)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Add Row Button */}
        <div className="mt-6">
          <button
            type="button"
            onClick={addRow}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Row
          </button>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Submit Items
          </button>
        </div>
      </form>

      {/* Additional styling for the container */}
      <div className="mt-10 text-gray-500 text-sm text-center">
        Add your inventory items manually. Ensure accurate data for better management.
      </div>
    </div>
  );
};

export default Inventory;
