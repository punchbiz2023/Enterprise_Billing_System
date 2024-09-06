import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ItemForm = () => {
    const [newItem, setNewItem] = useState({
        name: '',
        rate: '',
        type: '',
        unit: '',
        description: '',

    });
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewItem({ ...newItem, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            await axios.post('http://localhost:3001/api/items', newItem);
            navigate('/dashboard/items');
        } catch (error) {
            console.error('Error adding item:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-52">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Add New Item</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={newItem.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Rate</label>
                    <input
                        type="text"
                        name="rate"
                        value={newItem.rate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <select
                        name="type"
                        value={newItem.type}    
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                    >
                        <option value="" disabled hidden>Select type</option>
                        <option value="sales">Sales</option>
                        <option value="purchase">Purchase</option>
                    </select>
                </div>


                <div>
                    <label className="block text-sm font-medium text-gray-700">Unit</label>
                    <input
                        type="text"
                        name="unit"
                        value={newItem.unit}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        type="text"
                        name="description"
                        value={newItem.description}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 mt-1 h-12 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    Add Item
                </button>
            </form>
        </div>
    );
}

export default ItemForm;
