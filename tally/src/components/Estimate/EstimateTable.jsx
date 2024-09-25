import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SidePanel from '../Sales/SidePanel';

const EstimateTable = () => {
    const [estimates, setEstimates] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [selectedEstimates, setSelectedEstimates] = useState([]);
    const [showCheckboxes, setShowCheckboxes] = useState(false); // State to toggle checkboxes
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchEstimates();
    }, []);

    const fetchEstimates = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/estimates');
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
            await axios.delete('http://localhost:3001/api/estimates', { data: { ids: selectedEstimates } });
            fetchEstimates();
            setSelectedEstimates([]);
            setShowCheckboxes(false); // Hide checkboxes after deletion
        } catch (error) {
            console.error('Error deleting estimates:', error.response ? error.response.data : error.message);
        }
    };
 
    const filteredEstimates = estimates.filter(estimate =>
        estimate.cname.toLowerCase().startsWith(searchTerm.toLowerCase())
    );


    return (
        <div className="flex">
            <div className="w-1/5">
                <SidePanel />
            </div>
            <div className="w-4/5 p-6 mt-[4%] mr-[10%]">
                <h1 className="text-xl font-bold mb-4">Estimates List</h1>

                <div className="flex justify-between mb-4">
                    {/* Search bar on the left */}
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 border border-gray-600 rounded w-1/3"
                    />

                    {/* Buttons on the right */}
                    <div className="flex space-x-4">
                        <Link
                            to="/dashboard/sales/estimate/form"
                            className="inline-block px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Add estimate
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
                                            
                                                {estimate.cname}
                                            
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
}


export default EstimateTable
