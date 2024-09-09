import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddCustomer = () => {
    const [newCustomer, setNewCustomer] = useState({
        name: '',
        company: '',
        email: '',
        gstno: '',
        phone: '',
        amountToBeReceived: ''
    });
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCustomer({ ...newCustomer, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3001/api/customers', newCustomer);
            navigate('/dashboard/sales/customers');
        } catch (error) {
            console.error('Error adding customer:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-28">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Add New Customer</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={newCustomer.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Company</label>
                    <input
                        type="text"
                        name="company"
                        value={newCustomer.company}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={newCustomer.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">GST No</label>
                    <input
                        type="text"
                        name="gstno"
                        value={newCustomer.gstno}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                        type="text"
                        name="phone"
                        value={newCustomer.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Amount to be Received</label>
                    <input
                        type="number"
                        name="amountToBeReceived"
                        value={newCustomer.amountToBeReceived}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    Add Customer
                </button>
            </form>
        </div>
    );
}

export default AddCustomer;
