import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const PurchaseOrderDetails = () => {
  const { id } = useParams(); // Captures the id from the URL
  const [purchaseOrder, setPurchaseOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggedUser, setLoggedUser] = useState(null);


  useEffect(() => {
    if (loggedUser) {
      fetchPurchaseOrder(loggedUser);
    }
  }, [loggedUser]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    const decoded = jwtDecode(token)
    setLoggedUser(decoded.email); 

  }, [id]);
  const fetchPurchaseOrder = async (loggedUser) => {
    try {
      const response = await axios.get(`https://enterprisebillingsystem.onrender.com/api/purchaseorder`,{
        params:{loggedUser}
      });
      // Find the purchase order based on the ID from the params
      const fetchedPurchaseOrder = response.data.find(po => po.sno === parseInt(id));

      setPurchaseOrder(fetchedPurchaseOrder);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching purchase order details:', error.response ? error.response.data : error.message);
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500 text-lg">Loading...</p>;
  }

  if (!purchaseOrder) {
    return <p className="text-center text-red-500 text-lg">Purchase Order not found</p>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 p-4 mt-10">
      <div className="bg-white shadow-xl p-8 rounded-lg max-w-4xl w-full border border-gray-200">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Purchase Order Details</h1>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-lg"><span className="font-semibold text-gray-700">Name:</span> {purchaseOrder.name || 'None'}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Delivery:</span> {purchaseOrder.delivery || 'None'}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Order Number:</span> {purchaseOrder.orderno || 'None'}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Reference:</span> {purchaseOrder.ref || 'None'}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Date:</span> {purchaseOrder.date || 'None'}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Delivery Date:</span> {purchaseOrder.deliverydate || 'None'}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Terms:</span> {purchaseOrder.terms || 'None'}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Mode of Shipment:</span> {purchaseOrder.modeofshipment || 'None'}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">GST:</span> {purchaseOrder.gst || 'None'}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Total:</span> {purchaseOrder.total || 'None'}</p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Item Details</h2>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-300 space-y-4">
              {purchaseOrder.itemdetails.map((item, index) => (
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

export default PurchaseOrderDetails;
