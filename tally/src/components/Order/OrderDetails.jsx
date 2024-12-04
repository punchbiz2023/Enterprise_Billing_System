import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const OrderDetails = () => {
    const { id } = useParams(); // Captures the id from the URL
    const [salesOrder, setSalesOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loggedUser, setLoggedUser] = useState(null);

    useEffect(() => {
        if (loggedUser) {
            fetchSalesOrder(loggedUser);
        }
      }, [loggedUser]);
    
    useEffect(() => {
        const token = localStorage.getItem("accessToken")
        const decoded = jwtDecode(token)
        
        setLoggedUser(decoded.email); 

    }, [id]);
    const fetchSalesOrder = async (loggedUser) => {
        try {
            const response = await axios.get('https://enterprisebillingsystem.onrender.com/api/salesorder',{
                params:{loggedUser}
            });
            // Find the sales order based on the ID from the params
            const fetchedSalesOrder = response.data.find(order => order.sno === parseInt(id));

            setSalesOrder(fetchedSalesOrder);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching sales order details:', error.response ? error.response.data : error.message);
            setLoading(false);
        }
    };

    if (loading) {
        return <p className="text-center text-gray-500 text-lg">Loading...</p>;
    }

    if (!salesOrder) {
        return <p className="text-center text-red-500 text-lg">Sales order not found</p>;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-200 p-4 mt-10">
            <div className="bg-white shadow-xl p-8 rounded-lg max-w-4xl w-full border border-gray-200">
                <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Sales Order Details</h1>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-lg"><span className="font-semibold text-gray-700">Name:</span> {salesOrder.name}</p>
                            <p className="text-lg"><span className="font-semibold text-gray-700">State:</span> {salesOrder.state}</p>
                            <p className="text-lg"><span className="font-semibold text-gray-700">Contact Address:</span> {salesOrder.caddress}</p>
                            <p className="text-lg"><span className="font-semibold text-gray-700">Contact Number:</span> {salesOrder.contact}</p>
                            <p className="text-lg"><span className="font-semibold text-gray-700">Email:</span> {salesOrder.mail}</p>
                            <p className="text-lg"><span className="font-semibold text-gray-700">Invoice ID:</span> {salesOrder.invoiceid}</p>
                            <p className="text-lg"><span className="font-semibold text-gray-700">Order No:</span> {salesOrder.orderno}</p>
                            <p className="text-lg"><span className="font-semibold text-gray-700">Order Date:</span> {salesOrder.orderdate}</p>
                            <p className="text-lg"><span className="font-semibold text-gray-700">Shipment Date:</span> {salesOrder.shipmentdate}</p>
                            <p className="text-lg"><span className="font-semibold text-gray-700">Invoice Date:</span> {salesOrder.invoicedate}</p>
                            <p className="text-lg"><span className="font-semibold text-gray-700">Due Date:</span> {salesOrder.duedate}</p>
                            <p className="text-lg"><span className="font-semibold text-gray-700">Terms:</span> {salesOrder.terms}</p>
                            <p className="text-lg"><span className="font-semibold text-gray-700">Salesperson:</span> {salesOrder.salesperson}</p>
                            <p className="text-lg"><span className="font-semibold text-gray-700">Tax Type:</span> {salesOrder.taxtype}</p>
                            <p className="text-lg"><span className="font-semibold text-gray-700">Tax Rate:</span> {salesOrder.taxrate}</p>
                            <p className="text-lg"><span className="font-semibold text-gray-700">Total:</span> {salesOrder.total}</p>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Item Details</h2>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-300 space-y-4">
                            {salesOrder.itemdetails.map((item, index) => (
                                <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                                    {Object.entries(item).map(([key, value]) => (
                                        <div key={key} className="text-lg">
                                            <span className="font-semibold text-gray-700">{key}:</span> {value ? value : "None"}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
