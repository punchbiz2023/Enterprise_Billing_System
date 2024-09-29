import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const BillDetails = () => {
  const { id } = useParams(); // Captures the id from the URL
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBill = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/bill`);
        // Find the bill based on the ID from the params
        const fetchedBill = response.data.find(bill => bill.sno === parseInt(id));
        
        setBill(fetchedBill);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bill details:', error.response ? error.response.data : error.message);
        setLoading(false);
      }
    };

    fetchBill();
  }, [id]);

  if (loading) {
    return <p className="text-center text-gray-500 text-lg">Loading...</p>;
  }

  if (!bill) {
    return <p className="text-center text-red-500 text-lg">Bill not found</p>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 p-4 mt-10">
      <div className="bg-white shadow-xl p-8 rounded-lg max-w-4xl w-full border border-gray-200">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Bill Details</h1>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-lg"><span className="font-semibold text-gray-700">Name:</span> {bill.name || 'None'}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Bill Number:</span> {bill.billnumber || 'None'}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Order Number:</span> {bill.orderno || 'None'}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Bill Date:</span> {bill.billdate || 'None'}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Due Date:</span> {bill.duedate || 'None'}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Terms:</span> {bill.terms || 'None'}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Mode of Shipment:</span> {bill.modeofshipment || 'None'}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">GST:</span> {bill.gst || 'None'}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Total:</span> {bill.total || 'None'}</p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Item Details</h2>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-300 space-y-4">
              {bill.itemdetails.map((item, index) => (
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

export default BillDetails;
