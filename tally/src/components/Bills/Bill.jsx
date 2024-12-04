import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'
import { Link } from 'react-router-dom';
import SidePanel from '../Purchase/Sidepanel';

const Bill = () => {
    const [bill, setBill] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [selectedBill, setSelectedBill] = useState([]);
    const [showCheckboxes, setShowCheckboxes] = useState(false); // State to toggle checkboxes
    const [searchTerm, setSearchTerm] = useState(''); // State for search term
    const [searchBy, setSearchBy] = useState('name'); // State to track search category
    const [loggedUser, setLoggedUser] = useState(null);
    useEffect(() => {
        const token = localStorage.getItem("accessToken")
        const decoded = jwtDecode(token)
        
        setLoggedUser(decoded.email); 
    }, []);
    useEffect(() => {
        if (loggedUser) {
            fetchBills(loggedUser);
        }
    }, [loggedUser]);

    const fetchBills = async (loggedUser) => {
        try {
            const response = await axios.get('https://enterprisebillingsystem.onrender.com/api/bill',{
                params:{loggedUser}
            });
            if (response.data) {
                setBill(response.data);
                setDataLoaded(true);
            }
        } catch (error) {
            console.error('Error fetching bill data:', error.response ? error.response.data : error.message);
        }
    };

    const handleCheckboxChange = (billId) => {
        setSelectedBill(prevSelected =>
            prevSelected.includes(billId)
                ? prevSelected.filter(id => id !== billId)
                : [...prevSelected, billId]
        );
    };

    const handleDelete = async () => {
        if (selectedBill.length <= 0) return;

        try {
            await axios.delete('https://enterprisebillingsystem.onrender.com/api/bill', { data: { ids: selectedBill } });
            fetchBills(loggedUser);
            setSelectedBill([]);
            setShowCheckboxes(false); // Hide checkboxes after deletion
        } catch (error) {
            console.error('Error deleting bills:', error.response ? error.response.data : error.message);
        }
    };

    // Filter bills based on search term and selected category (searchBy)
    const filteredBills = bill.filter((bil) => {
        if (!searchTerm) return true; // If search term is empty, show all bills
        const value = bil[searchBy]?.toString().toLowerCase(); // Get value from the selected field
        return value && value.startsWith(searchTerm.toLowerCase());
    });

    return (
        <div className="flex">
            <div className="w-1/5">
                <SidePanel />
            </div>
            <div className="w-4/5 p-6 mt-[4%] mr-[10%]">
                <h1 className="text-xl font-bold mb-4">Bill List</h1>

                <div className="flex justify-between mb-4">
                    {/* Search bar on the left */}
                    <div className="flex w-1/3">
                        {/* Dropdown for selecting the search category */}
                        <select
                            value={searchBy}
                            onChange={(e) => setSearchBy(e.target.value)}
                            className="bg-gray-100 px-2 py-2 border border-gray-600 rounded-l text-gray-800 cursor-pointer focus:outline-none"
                        >
                            <option value="name">Vendor</option>
                            <option value="billnumber">Bill Number</option>
                            <option value="gst">GST</option>
                        </select>
                        <input
                            type="text"
                            placeholder={`Search by ${searchBy}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-gray-100 px-2 py-2 border border-gray-600 rounded-r w-full focus:outline-none"
                        />
                    </div>

                    {/* Buttons on the right */}
                    <div className="flex space-x-4">
                        <Link
                            to="/dashboard/purchase/bill/form"
                            className="inline-block px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Add Bill
                        </Link>
                        <button
                            onClick={() => {
                                setShowCheckboxes(!showCheckboxes);
                                if (showCheckboxes) {
                                    setSelectedBill([]); // Unselect all checkboxes when 'Cancel' is clicked
                                }
                            }}
                            className={`inline-block px-5 py-2 rounded text-white ${showCheckboxes ? 'bg-gray-500 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'}`}
                        >
                            {showCheckboxes ? 'Cancel' : 'Delete Bills'}
                        </button>
                        {showCheckboxes && selectedBill.length > 0 && (
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
                                <th className="py-2 px-4 border-b">Vendor</th>
                                <th className="py-2 px-4 border-b">Bill Number</th>
                                <th className="py-2 px-4 border-b">Due Date</th>
                                <th className="py-2 px-4 border-b">GST</th>
                                <th className="py-2 px-4 border-b">Grand Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!dataLoaded ? (
                                <tr>
                                    <td colSpan="7" className="py-2 px-4 text-center text-gray-500">
                                        Loading Bills...
                                    </td>
                                </tr>
                            ) : filteredBills.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="py-2 px-4 text-center text-gray-500">
                                        No Bills found
                                    </td>
                                </tr>
                            ) : (
                                filteredBills.map((bill, index) => (
                                    <tr key={bill.sno || index} className="hover:bg-gray-100">
                                        <td className="py-2 px-4 border-b">
                                            {showCheckboxes && (
                                                <input
                                                    type="checkbox"
                                                    className="form-checkbox"
                                                    onChange={() => handleCheckboxChange(bill.sno)}
                                                    checked={selectedBill.includes(bill.sno)}
                                                />
                                            )}
                                        </td>
                                        <td className="py-2 px-4 text-center border-b">
                                            <Link to={`/dashboard/purchase/bill/${bill.sno}`} className="text-blue-500 hover:underline">
                                                {bill.name}
                                            </Link>
                                        </td>
                                        <td className="py-2 px-4 text-center border-b">{bill.billnumber}</td>
                                        <td className="py-2 px-4 text-center border-b">{bill.duedate}</td>
                                        <td className="py-2 px-4 text-center border-b">{bill.gst}</td>
                                        <td className="py-2 px-4 text-center border-b">{bill.total}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Bill;
