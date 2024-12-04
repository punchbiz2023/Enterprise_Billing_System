import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const VendorDetails = () => {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  const [loggedUser, setLoggedUser] = useState(null);


  useEffect(() => {
    if (loggedUser) {
      fetchVendor(loggedUser);
    }
  }, [loggedUser]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    const decoded = jwtDecode(token)

    setLoggedUser(decoded.email);

  }, [id]);
  const fetchVendor = async (loggedUser) => {

    try {
      const response = await axios.get('https://enterprisebillingsystem.onrender.com/api/vendor', {
        params: { loggedUser }
      });
      const fetchedVendor = response.data.find(Vendor => Vendor.sno === parseInt(id));
      setVendor(fetchedVendor);
      setLoading(false);

    } catch (error) {
      console.error('Error fetching Vendor details:', error.response ? error.response.data : error.message);
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!vendor) {
    return <p>Vendor not found</p>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 p-4 mt-10">
      <div className="bg-white shadow-xl p-8 rounded-lg max-w-4xl w-full border border-gray-200">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">vendor Details</h1>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-lg"><span className="font-semibold text-gray-700">Name:</span> {vendor.name}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Display Name:</span> {vendor.dispname}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Company:</span> {vendor.company}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Email:</span> {vendor.mail}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Work Phone:</span> {vendor.workphone}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Mobile Phone:</span> {vendor.mobilephone}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">PAN Number:</span> {vendor.panno}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">GST Number:</span> {vendor.gstno}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Currency:</span> {vendor.currency}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Opening Balance:</span> {vendor.openingbalance}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Payment Terms:</span> {vendor.paymentterms}</p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Billing Address</h2>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
              <p className="text-lg"><span className="font-semibold text-gray-700">Door No:</span> {vendor.billaddress.doorNo}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Street:</span> {vendor.billaddress.street}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">City:</span> {vendor.billaddress.city}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">State:</span> {vendor.billaddress.state}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Country:</span> {vendor.billaddress.country}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Pincode:</span> {vendor.billaddress.pinCode}</p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Shipping Address</h2>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
              <p className="text-lg"><span className="font-semibold text-gray-700">Door No:</span> {vendor.shipaddress.doorNo}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Street:</span> {vendor.shipaddress.street}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">City:</span> {vendor.shipaddress.city}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">State:</span> {vendor.shipaddress.state}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Country:</span> {vendor.shipaddress.country}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Pincode:</span> {vendor.shipaddress.pinCode}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDetails;
