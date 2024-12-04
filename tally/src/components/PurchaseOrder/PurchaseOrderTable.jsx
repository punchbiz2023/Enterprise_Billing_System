import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SidePanel from '../Purchase/Sidepanel';
import { jwtDecode } from 'jwt-decode';

const PurchaseOrderTable = () => {
    const [order, setOrder] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState([]);
    const [showCheckboxes, setShowCheckboxes] = useState(false);
    const [searchTerm, setSearchTerm] = useState(''); 
    const [searchBy, setSearchBy] = useState('name'); 
    const [loggedUser, setLoggedUser] = useState(null);
    
    
    
    useEffect(() => {
        const token = localStorage.getItem("accessToken")
        const decoded = jwtDecode(token)
        setLoggedUser(decoded.email); 
        
    }, []);
    
    useEffect(() => {
        if (loggedUser) {
            fetchOrders(loggedUser);
        }
    }, [loggedUser]);
    const fetchOrders = async (loggedUser) => {
        try {
            const response = await axios.get('https://enterprisebillingsystem.onrender.com/api/purchaseorder',{
                params:{loggedUser}
            });
            if (response.data) {
                setOrder(response.data);
                setDataLoaded(true);
            }
        } catch (error) {
            console.error('Error fetching orders data:', error.response ? error.response.data : error.message);
        }
    };

    const handleCheckboxChange = (orderId) => {
        setSelectedOrder(prevSelected =>
            prevSelected.includes(orderId)
                ? prevSelected.filter(id => id !== orderId)
                : [...prevSelected, orderId]
        );
    };

    const handleDelete = async () => {
        if (selectedOrder.length <= 0) return;

        try {
            await axios.delete('https://enterprisebillingsystem.onrender.com/api/purchaseorder', { data: { ids: selectedOrder } });
            fetchOrders(loggedUser);
            setSelectedOrder([]);
            setShowCheckboxes(false); 
        } catch (error) {
            console.error('Error deleting customers:', error.response ? error.response.data : error.message);
        }
    };

    
    const filteredOrders = order.filter((ord) => {
        if (!searchTerm) return true; 
        const value = ord[searchBy]?.toString().toLowerCase(); 
        return value && value.startsWith(searchTerm.toLowerCase());
    });

    return (
        <div className="flex">
            <div className="w-1/5">
                <SidePanel />
            </div>
            <div className="w-4/5 p-6 mt-[4%] mr-[10%]">
                <h1 className="text-xl font-bold mb-4">Order List</h1>

                <div className="flex justify-between mb-4">
                    {/* Search bar on the left */}
                    <div className="flex w-1/3">
                        {/* Dropdown for selecting the search category */}
                        <select
                            value={searchBy}
                            onChange={(e) => setSearchBy(e.target.value)}
                            className="bg-gray-100 px-2 py-2 border border-gray-600 rounded-l text-gray-800 cursor-pointer focus:outline-none"
                        >
                            <option value="name">Name</option>
                            <option value="orderno">Order Number</option>
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
                            to="/dashboard/purchase/order/form"
                            className="inline-block px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Add Purchase Order
                        </Link>
                        <button
                            onClick={() => {
                                setShowCheckboxes(!showCheckboxes);
                                if (showCheckboxes) {
                                    setSelectedOrder([]); 
                                }
                            }}
                            className={`inline-block px-5 py-2 rounded text-white ${showCheckboxes ? 'bg-gray-500 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'}`}
                        >
                            {showCheckboxes ? 'Cancel' : 'Delete Orders'}
                        </button>
                        {showCheckboxes && selectedOrder.length > 0 && (
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
                                <th className="py-2 px-4 border-b">Order No</th>
                                <th className="py-2 px-4 border-b">Delivery Date</th>
                                <th className="py-2 px-4 border-b">Grand Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!dataLoaded ? (
                                <tr>
                                    <td colSpan="7" className="py-2 px-4 text-center text-gray-500">
                                        Loading Orders...
                                    </td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="py-2 px-4 text-center text-gray-500">
                                        No orders found
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order, index) => (
                                    <tr key={order.sno || index} className="hover:bg-gray-100">
                                        <td className="py-2 px-4 border-b">
                                            {showCheckboxes && (
                                                <input
                                                    type="checkbox"
                                                    className="form-checkbox"
                                                    onChange={() => handleCheckboxChange(order.sno)}
                                                    checked={selectedOrder.includes(order.sno)}
                                                />
                                            )}
                                        </td>
                                        

                                        <td className="py-2 px-4 text-center border-b">
                                        <Link to={`/dashboard/purchase/order/${order.sno}`} className="text-blue-500 hover:underline">
                                                {order.name}
                                            </Link>
                                        </td>
                                        <td className="py-2 px-4 text-center border-b">{order.orderno}</td>
                                        <td className="py-2 px-4 text-center border-b">{order.deliverydate}</td>
                                        <td className="py-2 px-4 text-center border-b">{order.total}</td>
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

export default PurchaseOrderTable;
