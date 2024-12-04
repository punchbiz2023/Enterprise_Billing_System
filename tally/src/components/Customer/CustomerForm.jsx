import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AddCustomer = () => {
    const [newCustomer, setNewCustomer] = useState({
        customerType: 'Business',
        name: '',
        company: '',
        dispname: '',
        mail: '',
        workphone: '',
        mobilephone: '',
        panno: '',
        gstno: '',
        currency: 'INR',
        openingbalance: '',
        paymentterms: 'Due on Receipt',
        billaddress: {
            doorNo: '',
            street: '',
            city: '',
            state: '',
            country: '',
            pinCode: ''
        },
        shipaddress: {
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
        const { name, value } = e.target;
        setNewCustomer({
            ...newCustomer,
            [name]: value,
        });
    };
    const handleAddressChange = (e, type) => {
        const { name, value } = e.target;
        setNewCustomer(prevState => ({
            ...prevState,
            [type]: {
                ...prevState[type],
                [name]: value,
            },
        }));
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Decode the JWT to get the logged user
            const token = localStorage.getItem('accessToken'); // Ensure this matches where you store the token
            const decoded = jwtDecode(token);
            const loggedUser = decoded.email; // Adjust this based on your JWT structure

            // Add logged user to the customer payload
            const customerData = { ...newCustomer, loggedUser };

            // console.log(customerData);

            // Post the customer data to the backend
            const response = await axios.post('https://enterprisebillingsystem.onrender.com/api/customers', customerData);
            console.log(response.data);

            navigate('/dashboard/sales/customers');
        } catch (error) {
            console.error('Error adding customer:', error.response ? error.response.data : error.message);
        }
    };
    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-28">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Add New Customer</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={newCustomer.name}
                            onChange={handleInputChange}
                            placeholder='Enter your name'
                            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Company Name</label>
                    <input
                        type="text"
                        name="company"
                        value={newCustomer.company}
                        onChange={handleInputChange}
                        placeholder='Enter Company name'
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Display Name</label>
                    <input
                        type="text"
                        name="dispname"
                        value={newCustomer.dispname}
                        onChange={handleInputChange}
                        placeholder='Enter name to be displayed'
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        name="mail"
                        value={newCustomer.mail}
                        onChange={handleInputChange}
                        placeholder='Enter email'
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div className="flex space-x-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Work Phone</label>
                        <input
                            type="text"
                            name="workphone"
                            value={newCustomer.workphone}
                            onChange={handleInputChange}
                            placeholder='Enter Work phone number'
                            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mobile Phone</label>
                        <input
                            type="text"
                            name="mobilephone"
                            value={newCustomer.mobilephone}
                            onChange={handleInputChange}
                            placeholder='Enter mobile number'
                            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">PAN</label>
                    <input
                        type="text"
                        name="panno"
                        value={newCustomer.panno}
                        onChange={handleInputChange}
                        placeholder='Enter PAN card number'
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">GST Number</label>
                    <input
                        type="text"
                        name="gstno"
                        value={newCustomer.gstno}
                        onChange={handleInputChange}
                        placeholder='Enter GST number'
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
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
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Opening Balance</label>
                    <input
                        type="number"
                        name="openingbalance"
                        value={newCustomer.openingbalance}
                        onChange={handleInputChange}
                        placeholder='Enter amount for opening balance'
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Payment Terms</label>
                    <select
                        name="paymentterms"
                        value={newCustomer.paymentterms}
                        onChange={handleInputChange}

                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="Due on Receipt">Due on Receipt</option>
                    </select>
                </div>

                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Billing Address</h2>
                    <div className="space-y-4">
                        {['doorNo', 'street', 'city', 'state', 'country', 'pinCode'].map((field) => (
                            <div key={field}>
                                <label className="block text-sm font-medium text-gray-700">{field}</label>
                                <input
                                    type="text"
                                    name={field}
                                    value={newCustomer.billaddress[field] || ''}
                                    placeholder={`Enter ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                                    onChange={(e) => handleAddressChange(e, 'billaddress')}
                                    className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Shipping Address</h2>
                    <div className="space-y-4">
                        {['doorNo', 'street', 'city', 'state', 'country', 'pinCode'].map((field) => (
                            <div key={field}>
                                <label className="block text-sm font-medium text-gray-700">{field}</label>
                                <input
                                    type="text"
                                    name={field}
                                    value={newCustomer.shipaddress[field] || ''}
                                    placeholder={`Enter ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                                    onChange={(e) => handleAddressChange(e, 'shipaddress')}
                                    className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                        ))}
                    </div>
                </div>


                <div className="text-center">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
                    >
                        Add Customer
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddCustomer;
