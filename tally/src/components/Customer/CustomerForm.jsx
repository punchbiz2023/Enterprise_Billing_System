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
        <div className="flex justify-center">
            <div className="w-full max-w-md">
                <h1 className="text-xl font-bold mb-20">Add New Customer</h1>
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-4">
                    <div className="col-span-2 flex items-center">
                        <label className="block text-sm font-medium mr-4">Customer Type</label>
                        <div className="flex items-center">
                            <input type="radio" id="business" name="customerType" value="Business" className="mr-2" />
                            <label htmlFor="business" className="mr-4">Business</label>
                            <input type="radio" id="individual" name="customerType" value="Individual" className="mr-2" />
                            <label htmlFor="individual">Individual</label>
                        </div>
                    </div>
                    <div className="col-span-2 flex items-center gap-4">
                        <label className="block text-sm font-medium">Primary Contact</label>
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium">Company Name</label>
                        <input
                            type="text"
                            name="companyName"
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-red-500">Customer Display Name*</label>
                        <input
                            type="text"
                            name="customerDisplayName"
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium">Customer Email</label>
                        <input
                            type="email"
                            name="customerEmail"
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium">Customer Phone</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="text"
                                name="workPhone"
                                placeholder="Work Phone"
                                className="w-full px-3 py-2 border rounded"
                                required
                            />
                            <input
                                type="text"
                                name="mobilePhone"
                                placeholder="Mobile"
                                className="w-full px-3 py-2 border rounded"
                                required
                            />
                        </div>
                    </div>

                    <div className="col-span-2 border-t pt-4 mt-4">
                        <h2 className="text-lg font-medium mb-4">Other Details</h2>
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium">PAN</label>
                        <input
                            type="text"
                            name="pan"
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium">Currency</label>
                        <select className="w-full px-3 py-2 border rounded">
                            <option value="INR">INR - Indian Rupee</option>
                            <option value="INR">EUR - Euro</option>
                            <option value="INR">USD - United Stated Dollar</option>
                        </select>
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium">Opening Balance</label>
                        <div className="flex items-center">
                            
                            <input
                                type="text"
                                name="openingBalance"
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium">Payment Terms</label>
                        <select className="w-full px-3 py-2 border rounded">
                            <option value="Due on Receipt">Due on Receipt</option>
                            <option value="Due on Receipt">Due by 1 month</option>
                            <option value="Due on Receipt">Due on 2 month</option>
                        </select>
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium">Portal Language</label>
                        <select className="w-full px-3 py-2 border rounded">
                            <option value="English">English</option>
                        </select>
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium">Documents</label>
                        <input
                            type="file"
                            name="documents"
                            className="w-full px-3 py-2 border rounded"
                            multiple
                        />
                        <small className="text-gray-500">You can upload a maximum of 10 files, 10MB each</small>
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium">Website URL</label>
                        <input
                            type="url"
                            name="websiteUrl"
                            className="w-full px-3 py-2 border rounded"
                            placeholder="ex: www.zylker.com"
                        />
                    </div>

                    <div className="col-span-2 border-t pt-4 mt-4">
                        <h2 className="text-lg font-medium mb-4">Address</h2>
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium">Street</label>
                        <input
                            type="text"
                            name="street"
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium">City</label>
                        <input
                            type="text"
                            name="city"
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium">State</label>
                        <input
                            type="text"
                            name="state"
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium">Zip Code</label>
                        <input
                            type="text"
                            name="zipCode"
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium">Country</label>
                        <input
                            type="text"
                            name="country"
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="col-span-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Add Customer
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddCustomer;
