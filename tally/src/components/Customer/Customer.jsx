import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SidePanel from '../sales/SidePanel';

const Customer = () => {
    const [customers, setCustomers] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const [showCheckboxes, setShowCheckboxes] = useState(false); // State to toggle checkboxes
    const [searchTerm, setSearchTerm] = useState(''); // State for search term

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
            setShowCheckboxes(false); // Hide checkboxes after deletion
        } catch (error) {
            console.error('Error deleting customers:', error.response ? error.response.data : error.message);
        }
    };

    // Filter customers based on the search term (starts with)
    const filteredCustomers = customers.filter(customer =>
        customer.dispname.toLowerCase().startsWith(searchTerm.toLowerCase())
    );

    return (
        <div className="flex">
            <div className="w-1/5">
                <SidePanel />
            </div>
            <div className="w-4/5 p-6 mt-[4%] mr-[10%]">
                <h1 className="text-xl font-bold mb-4">Customer List</h1>

                <div className="flex justify-between mb-4">
                    {/* Search bar on the left */}
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 border rounded w-1/3"
                    />

                    {/* Buttons on the right */}
                    <div className="flex space-x-4">
                        <Link
                            to="/dashboard/sales/customers/form"
                            className="inline-block px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Add Customer
                        </Link>
                        <button
                            onClick={() => {
                                setShowCheckboxes(!showCheckboxes);
                                if (showCheckboxes) {
                                    setSelectedCustomers([]); // Unselect all checkboxes when 'Cancel' is clicked
                                }
                            }}
                            className={`inline-block px-5 py-2 rounded text-white ${showCheckboxes ? 'bg-gray-500 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'}`}
                        >
                            {showCheckboxes ? 'Cancel' : 'Delete Customers'}
                        </button>
                        {showCheckboxes && selectedCustomers.length > 0 && (
                            <button
                                onClick={handleDelete}
                                className="inline-block px-5 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="py-2 px-4 border-b"></th>
                                <th className="py-2 px-4 border-b">Name</th>
                                <th className="py-2 px-4 border-b">Company</th>
                                <th className="py-2 px-4 border-b">Email</th>
                                <th className="py-2 px-4 border-b">Phone</th>
                                <th className="py-2 px-4 border-b">GST Number</th>
                                <th className="py-2 px-4 border-b">Opening Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!dataLoaded ? (
                                <tr>
                                    <td colSpan="7" className="py-2 px-4 text-center text-gray-500">
                                        Loading customers...
                                    </td>
                                </tr>
                            ) : filteredCustomers.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="py-2 px-4 text-center text-gray-500">
                                        No customers found
                                    </td>
                                </tr>
                            ) : (
                                filteredCustomers.map((customer, index) => (
                                    <tr key={customer.sno || index} className="hover:bg-gray-100">
                                        <td className="py-2 px-4 border-b">
                                            {showCheckboxes && (
                                                <input
                                                    type="checkbox"
                                                    className="form-checkbox"
                                                    onChange={() => handleCheckboxChange(customer.sno)}
                                                    checked={selectedCustomers.includes(customer.sno)}
                                                />
                                            )}
                                        </td>
                                        <td className="py-2 px-4 text-center border-b">
                                            <Link to={`/dashboard/sales/customer/${customer.sno}`} className="text-blue-500 hover:underline">
                                                {customer.dispname}
                                            </Link>
                                        </td>
                                        <td className="py-2 px-4 text-center border-b">{customer.company}</td>
                                        <td className="py-2 px-4 text-center border-b">{customer.mail}</td>
                                        <td className="py-2 px-4 text-center border-b">{customer.workphone}</td>
                                        <td className="py-2 px-4 text-center border-b">{customer.gstno}</td>
                                        <td className="py-2 px-4 text-center border-b">{customer.openingbalance}</td>
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
