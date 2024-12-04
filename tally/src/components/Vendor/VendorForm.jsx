import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AddVendor = () => {
    const [newVendor, setNewVendor] = useState({
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
    const [loggedUser, setLoggedUser] = useState(null);
    
    
    
    useEffect(() => {
        const token = localStorage.getItem("accessToken")
        const decoded = jwtDecode(token)
        setLoggedUser(decoded.email);  // Set loggedUser state
    }, [])

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewVendor({ ...newVendor, [name]: value });
    };

    const handleAddressChange = (e, type) => {
        const { name, value } = e.target;
        setNewVendor(prevState => ({
            ...prevState,
            [type]: {
                ...prevState[type],
                [name]: value,
            },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {...newVendor,loggedUser}
        try {
            await axios.post('https://enterprisebillingsystem.onrender.com/api/vendor', data);
            navigate('/dashboard/purchase/vendors');
        } catch (error) {
            console.error('Error adding vendor:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-28">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Add New Vendor</h1>
            <form onSubmit={handleSubmit} className="space-y-4">

                <div className="flex space-x-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={newVendor.name}
                            placeholder='Enter vendor name'
                            required
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Company Name</label>
                    <input
                        type="text"
                        name="company"
                        value={newVendor.company}
                        onChange={handleInputChange}
                        placeholder='Enter vendor company name'
                        required
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Display Name</label>
                    <input
                        type="text"
                        name="dispname"
                        value={newVendor.dispname}
                        onChange={handleInputChange}
                        placeholder='Enter the name should be displayed'
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        name="mail"
                        value={newVendor.mail}
                        onChange={handleInputChange}
                        placeholder='Enter the email id'
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
                            value={newVendor.workphone}
                            onChange={handleInputChange}
                            placeholder='Enter the work phone number'
                            required
                            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mobile Phone</label>
                        <input
                            type="text"
                            name="mobilephone"
                            value={newVendor.mobilephone}
                            onChange={handleInputChange}
                            placeholder='Enter your mobile number'
                            required
                            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">PAN</label>
                    <input
                        type="text"
                        name="panno"
                        value={newVendor.panno}
                        onChange={handleInputChange}
                        placeholder='Enter the PAN card number'
                        required
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">GST Number</label>
                    <input
                        type="text"
                        name="gstno"
                        value={newVendor.gstno}
                        onChange={handleInputChange}
                        placeholder='Enter the GST number'
                        required
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Currency</label>
                    <select
                        name="currency"
                        value={newVendor.currency}
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
                        value={newVendor.openingbalance}
                        onChange={handleInputChange}
                        placeholder='Enter the opening balance amount'
                        required
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Payment Terms</label>
                    <select
                        name="paymentterms"
                        value={newVendor.paymentterms}
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
                                    value={newVendor.billaddress[field] || ''}
                                    onChange={(e) => handleAddressChange(e, 'billaddress')}
                                    placeholder={`Enter ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                                    required
                                    className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
                                    value={newVendor.shipaddress[field] || ''}
                                    onChange={(e) => handleAddressChange(e, 'shipaddress')}
                                    placeholder={`Enter ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                                    required
                                    className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
                        Add Vendor
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddVendor;
