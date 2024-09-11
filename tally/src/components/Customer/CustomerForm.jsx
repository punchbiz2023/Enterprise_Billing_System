import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddCustomer = () => {
    const [newCustomer, setNewCustomer] = useState({
        customerType: 'Business',
        salutation: '',
        firstName: '',
        lastName: '',
        companyName: '',
        displayName: '',
        email: '',
        workPhone: '',
        mobilePhone: '',
        pan: '',
        currency: 'INR',
        openingBalance: '',
        paymentTerms: 'Due on Receipt',
        portalAccess: false,
        portalLanguage: 'English',
        billingAddress: {
            doorNo: '',
            street: '',
            city: '',
            state: '',
            country: '',
            pinCode: ''
        },
        shippingAddress: {
            doorNo: '',
            street: '',
            city: '',
            state: '',
            country: '',
            pinCode: ''
        }
    });

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewCustomer({
            ...newCustomer,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleAddressChange = (e, type) => {
        const { name, value } = e.target;
        setNewCustomer({
            ...newCustomer,
            [type]: {
                ...newCustomer[type],
                [name]: value,
            },
        });
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
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-28">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Add New Customer</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Basic Customer Information */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Customer Type</label>
                    <div className="flex items-center space-x-4">
                        <label>
                            <input
                                type="radio"
                                name="customerType"
                                value="Business"
                                checked={newCustomer.customerType === 'Business'}
                                onChange={handleInputChange}
                                className="mr-2"
                            />
                            Business
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="customerType"
                                value="Individual"
                                checked={newCustomer.customerType === 'Individual'}
                                onChange={handleInputChange}
                                className="mr-2"
                            />
                            Individual
                        </label>
                    </div>
                </div>
                <div className="flex space-x-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Salutation</label>
                        <input
                            type="text"
                            name="salutation"
                            value={newCustomer.salutation}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={newCustomer.firstName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={newCustomer.lastName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Company Name</label>
                    <input
                        type="text"
                        name="companyName"
                        value={newCustomer.companyName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Customer Display Name</label>
                    <input
                        type="text"
                        name="displayName"
                        value={newCustomer.displayName}
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
                <div className="flex space-x-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Work Phone</label>
                        <input
                            type="text"
                            name="workPhone"
                            value={newCustomer.workPhone}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mobile Phone</label>
                        <input
                            type="text"
                            name="mobilePhone"
                            value={newCustomer.mobilePhone}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">PAN</label>
                    <input
                        type="text"
                        name="pan"
                        value={newCustomer.pan}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">GST Number</label>
                    <input
                        type="text"
                        name="gst"
                        value={newCustomer.gstno}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Currency</label>
                    <select
                        name="currency"
                        value={newCustomer.currency}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="INR">INR - Indian Rupee</option>
                        {/* Add more currency options if needed */}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Opening Balance</label>
                    <input
                        type="number"
                        name="openingBalance"
                        value={newCustomer.openingBalance}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Payment Terms</label>
                    <select
                        name="paymentTerms"
                        value={newCustomer.paymentTerms}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="Due on Receipt">Due on Receipt</option>
                        {/* Add more payment terms if needed */}
                    </select>
                </div>
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        name="portalAccess"
                        checked={newCustomer.portalAccess}
                        onChange={handleInputChange}
                        className="mr-2"
                    />
                    <label className="block text-sm font-medium text-gray-700">Allow portal access for this customer</label>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Portal Language</label>
                    <select
                        name="portalLanguage"
                        value={newCustomer.portalLanguage}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="English">English</option>
                        {/* Add more language options if needed */}
                    </select>
                </div>

                {/* Address Information */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Billing Address</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Door No.</label>
                            <input
                                type="text"
                                name="doorNo"
                                value={newCustomer.billingAddress.doorNo}
                                onChange={(e) => handleAddressChange(e, 'billingAddress')}
                                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Street</label>
                            <input
                                type="text"
                                name="street"
                                value={newCustomer.billingAddress.street}
                                onChange={(e) => handleAddressChange(e, 'billingAddress')}
                                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">City</label>
                            <input
                                type="text"
                                name="city"
                                value={newCustomer.billingAddress.city}
                                onChange={(e) => handleAddressChange(e, 'billingAddress')}
                                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">State</label>
                            <input
                                type="text"
                                name="state"
                                value={newCustomer.billingAddress.state}
                                onChange={(e) => handleAddressChange(e, 'billingAddress')}
                                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Country</label>
                            <input
                                type="text"
                                name="country"
                                value={newCustomer.billingAddress.country}
                                onChange={(e) => handleAddressChange(e, 'billingAddress')}
                                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Pin Code</label>
                            <input
                                type="text"
                                name="pinCode"
                                value={newCustomer.billingAddress.pinCode}
                                onChange={(e) => handleAddressChange(e, 'billingAddress')}
                                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Shipping Address</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Door No.</label>
                            <input
                                type="text"
                                name="doorNo"
                                value={newCustomer.shippingAddress.doorNo}
                                onChange={(e) => handleAddressChange(e, 'shippingAddress')}
                                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Street</label>
                            <input
                                type="text"
                                name="street"
                                value={newCustomer.shippingAddress.street}
                                onChange={(e) => handleAddressChange(e, 'shippingAddress')}
                                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">City</label>
                            <input
                                type="text"
                                name="city"
                                value={newCustomer.shippingAddress.city}
                                onChange={(e) => handleAddressChange(e, 'shippingAddress')}
                                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">State</label>
                            <input
                                type="text"
                                name="state"
                                value={newCustomer.shippingAddress.state}
                                onChange={(e) => handleAddressChange(e, 'shippingAddress')}
                                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Country</label>
                            <input
                                type="text"
                                name="country"
                                value={newCustomer.shippingAddress.country}
                                onChange={(e) => handleAddressChange(e, 'shippingAddress')}
                                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Pin Code</label>
                            <input
                                type="text"
                                name="pinCode"
                                value={newCustomer.shippingAddress.pinCode}
                                onChange={(e) => handleAddressChange(e, 'shippingAddress')}
                                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
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
};

export default AddCustomer;
