import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SidePanel from '../Sales/sidepanel';

const Customer = () => {
    const [customers, setCustomers] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [selectedCustomers, setSelectedCustomers] = useState([]);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/customers');
            if (response.data) {
                setCustomers(response.data);
                setDataLoaded(true);
            }
        } catch (error) {
            console.error('Error fetching customer data:', error.response ? error.response.data : error.message);
        }
    };

    const handleCheckboxChange = (customerId) => {
        setSelectedCustomers(prevSelected =>
            prevSelected.includes(customerId)
                ? prevSelected.filter(id => id !== customerId)
                : [...prevSelected, customerId]
        );
    };

    const handleDelete = async () => {
        if (selectedCustomers.length <= 0) return;

        try {
            await axios.delete('http://localhost:3001/api/customers', { data: { ids: selectedCustomers } });
            fetchCustomers();
            setSelectedCustomers([]);
        } catch (error) {
            console.error('Error deleting customers:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="flex">
            <div className="w-1/5">
                {/* Side panel here */}
            </div>
            <div className="w-4/5 p-6  mt-16">
                <h1 className="text-xl font-bold mb-4">Customer List</h1>

                <div className="flex mb-4">
                    <Link
                        to="/dashboard/sales/customers/form"
                        className="inline-block px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ml-40 mt-6"
                    >
                        Add Customer
                    </Link>
                    {selectedCustomers.length > 0 && (
                        <button
                            onClick={handleDelete}
                            className="inline-block w-40 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Delete Selected
                        </button>
                    )}
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="py-2 px-4 border-b"></th>
                                <th className="py-2 px-4 border-b">Name</th>
                                <th className="py-2 px-4 border-b">Company</th>
                                <th className="py-2 px-4 border-b">Email</th>
                                <th className="py-2 px-4 border-b">GST Number</th>
                                <th className="py-2 px-4 border-b">Phone</th>
                                <th className="py-2 px-4 border-b">Amount to be Received</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!dataLoaded ? (
                                <tr>
                                    <td colSpan="7" className="py-2 px-4 text-center text-gray-500">
                                        Loading customers...
                                    </td>
                                </tr>
                            ) : customers.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="py-2 px-4 text-center text-gray-500">
                                        No customers found
                                    </td>
                                </tr>
                            ) : (
                                customers.map((customer, index) => (
                                    <tr key={customer.id || index} className="hover:bg-gray-100">
                                        <td className="py-2 px-4 border-b">
                                            <input
                                                type="checkbox"
                                                className="form-checkbox"
                                                onChange={() => handleCheckboxChange(customer.sno)}
                                                checked={selectedCustomers.includes(customer.sno)}
                                            />
                                        </td>

                                        <td className="py-2 px-4 border-b">{customer.name}</td>
                                        <td className="py-2 px-4 border-b">{customer.company}</td>
                                        <td className="py-2 px-4 border-b">{customer.email}</td>
                                        <td className="py-2 px-4 border-b">{customer.gstno}</td>
                                        <td className="py-2 px-4 border-b">{customer.phone}</td>
                                        <td className="py-2 px-4 border-b">{customer.amount}</td>
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

export default Customer;
