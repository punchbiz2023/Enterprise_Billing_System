import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'
import SidePanel from '../Sales/Sidepanel';

const CreditTable = () => {
    const [notes, setNotes] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [selectedNotes, setSelectedNotes] = useState([]);
    const [showCheckboxes, setShowCheckboxes] = useState(false); // State to toggle checkboxes
    const [searchTerm, setSearchTerm] = useState(''); // State for search term
    const [searchBy, setSearchBy] = useState('dispname'); // State to track search category
    const [loggedUser, setLoggedUser] = useState(null);
    useEffect(() => {
        const token = localStorage.getItem("accessToken")
        const decoded = jwtDecode(token)

        setLoggedUser(decoded.email);
    }, []);
    useEffect(() => {
        if (loggedUser) {
            fetchNotes(loggedUser);
        }
    }, [loggedUser]);

    const fetchNotes = async (loggedUser) => {
        try {
            const response = await axios.get('https://enterprisebillingsystem.onrender.com/api/creditnote', { params: { loggedUser } });
            if (response.data) {
                setNotes(response.data);
                setDataLoaded(true);
            }
        } catch (error) {
            console.error('Error fetching notes :', error.response ? error.response.data : error.message);
        }
    };

    const handleCheckboxChange = (customerId) => {
        setSelectedNotes(prevSelected =>
            prevSelected.includes(customerId)
                ? prevSelected.filter(id => id !== customerId)
                : [...prevSelected, customerId]
        );
    };

    const handleDelete = async () => {
        if (selectedNotes.length <= 0) return;

        try {
            await axios.delete('https://enterprisebillingsystem.onrender.com/api/creditnote', { data: { ids: selectedNotes } });
            fetchNotes(loggedUser);
            setSelectedNotes([]);
            setShowCheckboxes(false); // Hide checkboxes after deletion
        } catch (error) {
            console.error('Error deleting Notes:', error.response ? error.response.data : error.message);
        }
    };

    // Filter Notes based on search term and selected category (searchBy)
    const filteredNotes = notes.filter((note) => {
        if (!searchTerm) return true; // If search term is empty, show all Notes
        const value = note[searchBy]?.toLowerCase(); // Get value from the selected field
        return value && value.startsWith(searchTerm.toLowerCase());
    });

    return (
        <div className="flex">
            <div className="w-1/5">
                <SidePanel />
            </div>
            <div className="w-4/5 p-6 mt-[4%] mr-[10%]">
                <h1 className="text-xl font-bold mb-4">Credit Notes</h1>

                <div className="flex justify-between mb-4">
                    {/* Search bar on the left */}
                    <div className="flex w-1/3">

                        {/* Dropdown after the search input */}
                        <select
                            value={searchBy}
                            onChange={(e) => setSearchBy(e.target.value)}
                            className="bg-gray-100 px-2 py-2 border border-gray-600 rounded-l text-gray-800 cursor-pointer focus:outline-none"
                        >
                            <option value="name">Name</option>
                            <option value="creditno">Credit No</option>
                            {/* <option value="creditdate">Date</option> */}
                            <option value="notes">Note</option>
                            <option value="amount">Total</option>
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
                            to="/dashboard/sales/credit/form"
                            className="inline-block px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Add Credit Note
                        </Link>
                        <button
                            onClick={() => {
                                setShowCheckboxes(!showCheckboxes);
                                if (showCheckboxes) {
                                    setSelectedNotes([]); // Unselect all checkboxes when 'Cancel' is clicked
                                }
                            }}
                            className={`inline-block px-5 py-2 rounded text-white ${showCheckboxes ? 'bg-gray-500 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'}`}
                        >
                            {showCheckboxes ? 'Cancel' : 'Delete Notes'}
                        </button>
                        {showCheckboxes && selectedNotes.length > 0 && (
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
                                <th className="py-2 px-4 border-b">Credit No</th>
                                <th className="py-2 px-4 border-b">Date</th>
                                <th className="py-2 px-4 border-b">Note</th>
                                <th className="py-2 px-4 border-b">Total</th>
                                {/* <th className="py-2 px-4 border-b">Opening Balance</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {!dataLoaded ? (
                                <tr>
                                    <td colSpan="7" className="py-2 px-4 text-center text-gray-500">
                                        Loading Notes...
                                    </td>
                                </tr>
                            ) : filteredNotes.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="py-2 px-4 text-center text-gray-500">
                                        No Notes found
                                    </td>
                                </tr>
                            ) : (
                                filteredNotes.map((note, index) => (
                                    <tr key={note.sno || index} className="hover:bg-gray-100">
                                        <td className="py-2 px-4 border-b">
                                            {showCheckboxes && (
                                                <input
                                                    type="checkbox"
                                                    className="form-checkbox"
                                                    onChange={() => handleCheckboxChange(note.sno)}
                                                    checked={selectedNotes.includes(note.sno)}
                                                />
                                            )}
                                        </td>
                                        <td className="py-2 px-4 text-center border-b">
                                            <Link to={`/dashboard/sales/credit/${note.sno}`} className="text-blue-500 hover:underline">
                                                {note.name}
                                            </Link>
                                        </td>
                                        <td className="py-2 px-4 text-center border-b">{note.creditno}</td>
                                        <td className="py-2 px-4 text-center border-b">{note.creditdate}</td>
                                        <td className="py-2 px-4 text-center border-b">{note.notes}</td>

                                        <td className="py-2 px-4 text-center border-b">{note.amount}</td>
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


export default CreditTable
