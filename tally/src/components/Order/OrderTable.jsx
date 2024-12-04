import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SidePanel from '../Sales/Sidepanel';
import { jwtDecode } from 'jwt-decode';

const OrderTable = () => {
    const [order, setOrder] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState([]);
    const [showCheckboxes, setShowCheckboxes] = useState(false);
    const [loggedUser, setLoggedUser] = useState(null);

    useEffect(() => {
        if (loggedUser) {
            fetchOrders(loggedUser);
        }
      }, [loggedUser]);
    useEffect(() => {
        const token = localStorage.getItem("accessToken")
        const decoded = jwtDecode(token)
        
        setLoggedUser(decoded.email); 
    }, [])
    
    const fetchOrders = async (loggedUser) => {
        try {
            // console.log(order.state);
            const response = await axios.get('https://enterprisebillingsystem.onrender.com/api/salesorder',{
                params:{loggedUser}
            });
            if (response.data) {
                setOrder(response.data);
                
                
                setDataLoaded(true);
            }
        } catch (error) {
            console.error('Error fetching orders data:', error.response ? error.response.data : error.message);
        }
    }

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
            await axios.delete('https://enterprisebillingsystem.onrender.com/api/salesorder', { data: { ids: selectedOrder } });
            fetchOrders(loggedUser);
            setSelectedOrder([]);
            setShowCheckboxes(false); // Hide checkboxes after deletion
        } catch (error) {
            console.error('Error deleting customers:', error.response ? error.response.data : error.message);
        }
    };


    return (
        <div className="flex">
            <div className="w-1/5">
                <SidePanel />
            </div>
            <div className="w-4/5 p-6 mt-[4%] mr-[10%]">
                <h1 className="text-xl font-bold mb-4">Order List</h1>

                <div className="flex justify-between mb-4">
                    <Link
                        to="/dashboard/sales/order/form"
                        className="inline-block px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Add sales Order
                    </Link>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => setShowCheckboxes(!showCheckboxes)}
                            className={`inline-block px-5 py-2 rounded text-white ${showCheckboxes ? 'bg-gray-500 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'}`}
                        >
                            {showCheckboxes ? 'Cancel' : 'Delete Customers'}
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
                                <th className="py-2 px-4 border-b">Shipment Date</th>
                                {/* <th className="py-2 px-4 border-b">Payment Terms</th> */}
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
                            ) : order.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="py-2 px-4 text-center text-gray-500">
                                        No order found
                                    </td>
                                </tr>
                            ) : (
                                order.map((order, index) => (
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
                                        <Link to={`/dashboard/sales/order/${order.sno}`} className="text-blue-500 hover:underline">
                                            {order.name}
                                        </Link>
                                        </td>
                                        <td className="py-2 px-4 text-center border-b">{order.orderno}</td>
                                        <td className="py-2 px-4 text-center border-b">{order.shipmentdate}</td>
                                        {/* <td className="py-2 px-4 text-center border-b">{order.gstno}</td> */}
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
}

export default OrderTable