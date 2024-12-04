import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';


const Inventory = () => {
    const [inventory, setInventory] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [selectedInventory, setSelectedInventory] = useState([]);
    const [orderData, setOrderData] = useState([]);
    const [showCheckboxes, setShowCheckboxes] = useState(false); // State to toggle checkboxes
    const [searchTerm, setSearchTerm] = useState(''); // State for search term
    const [searchBy, setSearchBy] = useState('itemName'); // State to track search category
    const [loggedUser, setLoggedUser] = useState(null);

    useEffect(() => {
        if (loggedUser) {
            fetchInventory(loggedUser);
            fetchSalesOrder(loggedUser);
        }
    }, [loggedUser]);
    useEffect(() => {
        const token = localStorage.getItem("accessToken")
        const decoded = jwtDecode(token)
        
        setLoggedUser(decoded.email); 
        // quantityUpdate();
    }, []);

    const fetchInventory = async (loggedUser) => {
        try {
            const response = await axios.get('https://enterprisebillingsystem.onrender.com/api/inventory',{
                params:{loggedUser}
            });
            if (response.data) {
                setInventory(response.data);
                setDataLoaded(true);
            }
        } catch (error) {
            console.error('Error fetching invent data:', error.response ? error.response.data : error.message);
        }
    };
    const fetchSalesOrder = async (loggedUser) => {
        try {
            const response = await axios.get('https://enterprisebillingsystem.onrender.com/api/salesorder',{
                params:{loggedUser}
            });
            if (response.data) {
                setOrderData(response.data);
            }
        } catch (error) {
            console.error('Error fetching invent data:', error.response ? error.response.data : error.message);
        }

    };

    const handleCheckboxChange = (inventId) => {
        setSelectedInventory(prevSelected =>
            prevSelected.includes(inventId)
                ? prevSelected.filter(id => id !== inventId)
                : [...prevSelected, inventId]
        );
    };

    const handleDelete = async () => {
        if (selectedInventory.length <= 0) return;

        try {
            await axios.delete('https://enterprisebillingsystem.onrender.com/api/inventory', { data: { ids: selectedInventory } });
            fetchInventory(loggedUser);
            setSelectedInventory([]);
            setShowCheckboxes(false); // Hide checkboxes after deletion
        } catch (error) {
            console.error('Error deleting inventory:', error.response ? error.response.data : error.message);
        }
    };

    // Filter inventory based on search term and selected category (searchBy)
    const filteredInventory = inventory.filter((invent) => {
        if (!searchTerm) return true; // If search term is empty, show all inventory
        const value = invent[searchBy]?.toLowerCase(); // Get value from the selected field
        return value && value.startsWith(searchTerm.toLowerCase());
    });

    return (
        <div className="flex">

            <div className="w-4/5 p-6 ml-[200px] mt-[4%] mr-[10%]">
                <h1 className="text-xl font-bold mb-4">Inventory</h1>

                <div className="flex justify-between mb-4">
                    {/* Search bar on the left */}
                    <div className="flex w-1/3">

                        {/* Dropdown after the search input */}
                        <select
                            value={searchBy}
                            onChange={(e) => setSearchBy(e.target.value)}
                            className="bg-gray-100 px-2 py-2 border border-gray-600 rounded-l text-gray-800 cursor-pointer focus:outline-none"
                        >
                            <option value="itemName">Name</option>
                            <option value="code">Item Code</option>
                            <option value="hsn">HSN Code</option>
                            <option value="workphone">Rate</option>
                            <option value="gstno">GST Number</option>
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
                        
                        <button
                            onClick={() => {
                                setShowCheckboxes(!showCheckboxes);
                                if (showCheckboxes) {
                                    setSelectedInventory([]); // Unselect all checkboxes when 'Cancel' is clicked
                                }
                            }}
                            className={`inline-block px-5 py-2 rounded text-white ${showCheckboxes ? 'bg-gray-500 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'}`}
                        >
                            {showCheckboxes ? 'Cancel' : 'Delete Inventory'}
                        </button>
                        {showCheckboxes && selectedInventory.length > 0 && (
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
                                <th className="py-1 px-1 border-b"></th>
                                <th className="py-2 px-4 border-b">Name</th>
                                <th className="py-2 px-4 border-b">Item Code</th>
                                <th className="py-2 px-4 border-b">HSN Code</th>
                                <th className="py-2 px-4 border-b">Quantity</th>
                                <th className="py-2 px-4 border-b">Rate</th>
                                <th className="py-2 px-4 border-b">GST</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!dataLoaded ? (
                                <tr>
                                    <td colSpan="7" className="py-2 px-4 text-center text-gray-500">
                                        Loading inventory...
                                    </td>
                                </tr>
                            ) : filteredInventory.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="py-2 px-4 text-center text-gray-500">
                                        No items found in Inventory
                                    </td>
                                </tr>
                            ) : (
                                filteredInventory.map((invent, index) => (
                                    <tr key={invent.sno || index} className="hover:bg-gray-100">
                                        <td className="py-2 px-4 border-b">
                                            {showCheckboxes && (
                                                <input
                                                    type="checkbox"
                                                    className="form-checkbox"
                                                    onChange={() => handleCheckboxChange(invent.sno)}
                                                    checked={selectedInventory.includes(invent.sno)}
                                                />
                                            )}
                                        </td>

                                        <td className="py-2 px-4 text-center border-b">{invent.itemName}</td>
                                        <td className="py-2 px-4 text-center border-b">{invent.itemCode}</td>
                                        <td className="py-2 px-4 text-center border-b">{invent.hsnCode}</td>
                                        <td className="py-2 px-4 text-center border-b">{invent.quantity}</td>
                                        <td className="py-2 px-4 text-center border-b">{invent.rate}</td>
                                        <td className="py-2 px-4 text-center border-b">{invent.gst}</td>
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

export default Inventory;