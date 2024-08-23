import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddCustomer = () => {
    const [newVendor, setNewVendor] = useState({
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
        setNewVendor({ ...newVendor, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3001/api/vendor', newVendor);
            navigate('/dashboard/purchase/vendors');
        } catch (error) {
            console.error('Error adding customer:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">Add New Vendor</h1>
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="mb-2">
                    <label className="block text-sm font-medium">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={newVendor.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-2">
                    <label className="block text-sm font-medium">Company</label>
                    <input
                        type="text"
                        name="company"
                        value={newVendor.company}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-2">
                    <label className="block text-sm font-medium">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={newVendor.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-2">
                    <label className="block text-sm font-medium">GST No</label>
                    <input
                        type="text"
                        name="gstno"
                        value={newVendor.gstno}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-2">
                    <label className="block text-sm font-medium">Phone</label>
                    <input
                        type="text"
                        name="phone"
                        value={newVendor.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium">Amount to be Paid</label>
                    <input
                        type="number"
                        name="amountToBeReceived"
                        value={newVendor.amountToBeReceived}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Add Customer
                </button>
            </form>
        </div>
    );
}

export default AddCustomer;
