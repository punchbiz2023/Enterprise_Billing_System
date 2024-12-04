import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';
import SidePanel from '../Sales/Sidepanel';

const EstimateTable = () => {
    const [estimates, setEstimates] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [selectedEstimates, setSelectedEstimates] = useState([]);
    const [showCheckboxes, setShowCheckboxes] = useState(false); // State to toggle checkboxes
    const [searchTerm, setSearchTerm] = useState(''); // State for search term
    const [searchBy, setSearchBy] = useState('cname'); // State to track search category
    const [loggedUser, setLoggedUser] = useState(null);
    useEffect(() => {
        const token = localStorage.getItem("accessToken")
        const decoded = jwtDecode(token)
        
        setLoggedUser(decoded.email); 
    }, []);
    useEffect(() => {
        if (loggedUser) {
            fetchEstimates(loggedUser);
        }
    }, [loggedUser]);

    const fetchEstimates = async (loggedUser) => {
        try {
            const response = await axios.get('https://enterprisebillingsystem.onrender.com/api/estimates',{
                params:{loggedUser}
            });
            if (response.data) {
                setEstimates(response.data);
                setDataLoaded(true);
            }
        } catch (error) {
            console.error('Error fetching estimate data:', error.response ? error.response.data : error.message);
        }
    };

    const handleCheckboxChange = (estimateId) => {
        setSelectedEstimates(prevSelected =>
            prevSelected.includes(estimateId)
                ? prevSelected.filter(id => id !== estimateId)
                : [...prevSelected, estimateId]
        );
    };

    const handleDelete = async () => {
        if (selectedEstimates.length <= 0) return;

        try {
            await axios.delete('https://enterprisebillingsystem.onrender.com/api/estimates', { data: { ids: selectedEstimates } });
            fetchEstimates(loggedUser);
            setSelectedEstimates([]);
            setShowCheckboxes(false); // Hide checkboxes after deletion
        } catch (error) {
            console.error('Error deleting estimates:', error.response ? error.response.data : error.message);
        }
    };

    // Filter estimates based on search term and selected category (searchBy)
    const filteredEstimates = estimates.filter((estimate) => {
        if (!searchTerm) return true; // If search term is empty, show all estimates
        const value = estimate[searchBy]?.toString().toLowerCase(); // Get value from the selected field
        return value && value.startsWith(searchTerm.toLowerCase());
    });

    return (
        <div className="flex">
            <div className="w-1/5">
                <SidePanel />
            </div>
            <div className="w-4/5 p-6 mt-[4%] mr-[10%]">
                <h1 className="text-xl font-bold mb-4">Estimates List</h1>

                <div className="flex justify-between mb-4">
                    {/* Search bar on the left */}
                    <div className="flex w-1/3">
                        {/* Dropdown for selecting the search category */}
                        <select
                            value={searchBy}
                            onChange={(e) => setSearchBy(e.target.value)}
                            className="bg-gray-100 px-2 py-2 border border-gray-600 rounded-l text-gray-800 cursor-pointer focus:outline-none"
                        >
                            <option value="cname">Name</option>
                            <option value="quotenum">Quote Number</option>
                        </select>
                        <input
                            type="text"
                            placeholder={`Search by ${searchBy === 'cname' ? 'name' : 'quote number'}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-gray-100 px-2 py-2 border border-gray-600 rounded-r w-full focus:outline-none"
                        />
                    </div>

                    {/* Buttons on the right */}
                    <div className="flex space-x-4">
                        <Link
                            to="/dashboard/sales/estimate/form"
                            className="inline-block px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Add Estimate
                        </Link>
                        <button
                            onClick={() => {
                                setShowCheckboxes(!showCheckboxes);
                                if (showCheckboxes) {
                                    setSelectedEstimates([]); // Unselect all checkboxes when 'Cancel' is clicked
                                }
                            }}
                            className={`inline-block px-5 py-2 rounded text-white ${showCheckboxes ? 'bg-gray-500 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'}`}
                        >
                            {showCheckboxes ? 'Cancel' : 'Delete Estimates'}
                        </button>
                        {showCheckboxes && selectedEstimates.length > 0 && (
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
                                <th className="py-2 px-4 border-b">Quote Number</th>
                                <th className="py-2 px-4 border-b">Expiry Date</th>
                                <th className="py-2 px-4 border-b">Tax Type</th>
                                <th className="py-2 px-4 border-b">Tax Rate</th>
                                <th className="py-2 px-4 border-b">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!dataLoaded ? (
                                <tr>
                                    <td colSpan="7" className="py-2 px-4 text-center text-gray-500">
                                        Loading Estimates...
                                    </td>
                                </tr>
                            ) : filteredEstimates.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="py-2 px-4 text-center text-gray-500">
                                        No Estimates found
                                    </td>
                                </tr>
                            ) : (
                                filteredEstimates.map((estimate, index) => (
                                    <tr key={estimate.sno || index} className="hover:bg-gray-100">
                                        <td className="py-2 px-4 border-b">
                                            {showCheckboxes && (
                                                <input
                                                    type="checkbox"
                                                    className="form-checkbox"
                                                    onChange={() => handleCheckboxChange(estimate.sno)}
                                                    checked={selectedEstimates.includes(estimate.sno)}
                                                />
                                            )}
                                        </td>
                                        
                                        <td className="py-2 px-4 text-center border-b">
                                            <Link to={`/dashboard/sales/estimate/${estimate.sno}`}  className="text-blue-500 hover:underline" >
                                                {estimate.cname}
                                            </Link>
                                            
                                        </td>
                                        <td className="py-2 px-4 text-center border-b">{estimate.quotenum}</td>
                                        <td className="py-2 px-4 text-center border-b">{estimate.expdate}</td>
                                        <td className="py-2 px-4 text-center border-b">{estimate.taxtype}</td>
                                        <td className="py-2 px-4 text-center border-b">{estimate.taxrate}</td>
                                        <td className="py-2 px-4 text-center border-b">{estimate.total}</td>
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

export default EstimateTable;
