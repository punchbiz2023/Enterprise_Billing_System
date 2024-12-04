import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'
import axios from 'axios';

const BillDetails = () => {
  const { id } = useParams(); // Captures the id from the URL
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggedUser, setLoggedUser] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    const decoded = jwtDecode(token)

    setLoggedUser(decoded.email);
    
  }, [id]);
  useEffect(() => {
    if (loggedUser) {
      fetchBill(loggedUser);
    }
  }, [loggedUser]);
  const fetchBill = async (loggedUser) => {
    try {
      const response = await axios.get(`https://enterprisebillingsystem.onrender.com/api/bill`, {
        params: { loggedUser }
      });

      // Find the bill based on the ID from the params
      const fetchedBill = response.data.find(bill => bill.sno === parseInt(id));

      setBill(fetchedBill);
      setLoading(false);

    } catch (error) {
      console.error('Error fetching bill details:', error.response ? error.response.data : error.message);
      setLoading(false);
    }
  };


  if (loading) {
    return <p className="text-center text-gray-500 text-lg">Loading...</p>;
  }

  if (!bill) {
    return <p className="text-center text-red-500 text-lg">Bill not found</p>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-xl p-6 rounded-lg w-full max-w-5xl border border-gray-200">
        <h1 className="text-3xl font-semibold mb-6 mt-16  text-center text-gray-800">Bill Details</h1>

        {/* Bill Information Table */}
        <table className="min-w-full bg-white border-collapse border border-gray-300 mb-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left py-3 px-4 border-b border-gray-300">Field</th>
              <th className="text-left py-3 px-4 border-b border-gray-300">Details</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-3 px-4 border-b border-gray-300">Name</td>
              <td className="py-3 px-4 border-b border-gray-300">{bill.name || 'None'}</td>
            </tr>
            <tr>
              <td className="py-3 px-4 border-b border-gray-300">Bill Number</td>
              <td className="py-3 px-4 border-b border-gray-300">{bill.billnumber || 'None'}</td>
            </tr>
            <tr>
              <td className="py-3 px-4 border-b border-gray-300">Order Number</td>
              <td className="py-3 px-4 border-b border-gray-300">{bill.orderno || 'None'}</td>
            </tr>
            <tr>
              <td className="py-3 px-4 border-b border-gray-300">Bill Date</td>
              <td className="py-3 px-4 border-b border-gray-300">{bill.billdate || 'None'}</td>
            </tr>
            <tr>
              <td className="py-3 px-4 border-b border-gray-300">Due Date</td>
              <td className="py-3 px-4 border-b border-gray-300">{bill.duedate || 'None'}</td>
            </tr>
            <tr>
              <td className="py-3 px-4 border-b border-gray-300">Terms</td>
              <td className="py-3 px-4 border-b border-gray-300">{bill.terms || 'None'}</td>
            </tr>
            <tr>
              <td className="py-3 px-4 border-b border-gray-300">Mode of Shipment</td>
              <td className="py-3 px-4 border-b border-gray-300">{bill.modeofshipment || 'None'}</td>
            </tr>
            <tr>
              <td className="py-3 px-4 border-b border-gray-300">GST</td>
              <td className="py-3 px-4 border-b border-gray-300">{bill.gst || 'None'}</td>
            </tr>
            <tr>
              <td className="py-3 px-4 border-b border-gray-300">Total</td>
              <td className="py-3 px-4 border-b border-gray-300">{bill.total || 'None'}</td>
            </tr>
          </tbody>
        </table>

        {/* Item Details Table */}
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Item Details</h2>
        <table className="min-w-full bg-white border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left py-3 px-4 border-b border-gray-300">S.No</th>
              <th className="text-left py-3 px-4 border-b border-gray-300">Item Name</th>
              <th className="text-left py-3 px-4 border-b border-gray-300">Quantity</th>
              <th className="text-left py-3 px-4 border-b border-gray-300">Price</th>
            </tr>
          </thead>
          <tbody>
            {bill.itemdetails.length > 0 ? (
              bill.itemdetails.map((item, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="py-3 px-4 border-b border-gray-300">{index + 1}</td>
                  <td className="py-3 px-4 border-b border-gray-300">{item.iname || 'None'}</td>
                  <td className="py-3 px-4 border-b border-gray-300">{item.quantity || 'None'}</td>
                  <td className="py-3 px-4 border-b border-gray-300">{item.amount || 'None'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-3 text-gray-500">No items found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BillDetails;
