import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const CustomerDetails = () => {
  const { id } = useParams(); // Captures the id from the URL
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggedUser, setLoggedUser] = useState(null);

  useEffect(() => {
    if (loggedUser) {
      fetchCustomer(loggedUser);
    }
}, [loggedUser]);
  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    const decoded = jwtDecode(token)
    
    setLoggedUser(decoded.email); 

  }, [id]);
    const fetchCustomer = async (loggedUser) => {
      try {
        const response = await axios.get('https://enterprisebillingsystem.onrender.com/api/customers',{
          params:{loggedUser}
        });
        // Find the customer based on the ID from the params
        const fetchedCustomer = response.data.find(customer => customer.sno === parseInt(id));

        setCustomer(fetchedCustomer);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching customer details:', error.response ? error.response.data : error.message);
        setLoading(false);
      }
    };

  if (loading) {
    return <p className="text-center text-gray-500 text-lg">Loading...</p>;
  }

  if (!customer) {
    return <p className="text-center text-red-500 text-lg">Customer not found</p>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 p-4 mt-10">
      <div className="bg-white shadow-xl p-8 rounded-lg max-w-4xl w-full border border-gray-200">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Customer Details</h1>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-lg"><span className="font-semibold text-gray-700">Customer Type:</span> {customer.customerType}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Name:</span> {customer.name}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Display Name:</span> {customer.dispname}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Company:</span> {customer.company}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Email:</span> {customer.mail}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Work Phone:</span> {customer.workphone}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Mobile Phone:</span> {customer.mobilephone}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">PAN Number:</span> {customer.panno}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">GST Number:</span> {customer.gstno}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Currency:</span> {customer.currency}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Opening Balance:</span> {customer.openingbalance}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Payment Terms:</span> {customer.paymentterms}</p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Billing Address</h2>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
              <p className="text-lg"><span className="font-semibold text-gray-700">Door No:</span> {customer.billaddress.doorNo}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Street:</span> {customer.billaddress.street}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">City:</span> {customer.billaddress.city}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">State:</span> {customer.billaddress.state}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Country:</span> {customer.billaddress.country}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Pincode:</span> {customer.billaddress.pinCode}</p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Shipping Address</h2>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
              <p className="text-lg"><span className="font-semibold text-gray-700">Door No:</span> {customer.shipaddress.doorNo}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Street:</span> {customer.shipaddress.street}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">City:</span> {customer.shipaddress.city}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">State:</span> {customer.shipaddress.state}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Country:</span> {customer.shipaddress.country}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Pincode:</span> {customer.shipaddress.pinCode}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
