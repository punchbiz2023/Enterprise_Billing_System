import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const VendorDetails = () => {
  const { id } = useParams(); // This should capture the id from the URL
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendor = async () => {
    //   console.log(`Fetching Vendor with id: ${id}`); // Check if id is being logged correctly
      try {
        const response = await axios.get('http://localhost:3001/api/vendor');
        // console.log(response.data); // Check if the data is fetched
        // Filter the Vendor based on the id
        const fetchedVendor = response.data.find(Vendor => Vendor.sno === parseInt(id));
        setVendor(fetchedVendor);
        setLoading(false);

      } catch (error) {
        console.error('Error fetching Vendor details:', error.response ? error.response.data : error.message);
        setLoading(false);
      }
    };

    fetchVendor();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!vendor) {
    return <p>Vendor not found</p>;
  }

  return (
    <div className="flex vendors-center justify-center min-h-screen">
      <div className="bg-white shadow-lg p-10 rounded-lg text-center">
        <h1 className="text-2xl font-bold mb-5">vendor Details</h1>
        <p className="mb-3"><strong>Name:</strong> {vendor.name}</p>
        <p className="mb-3"><strong>Company:</strong> {vendor.company}</p>
        <p className="mb-3"><strong>Mail:</strong> {vendor.email}</p>        
        <p className="mb-3"><strong>GST NO:</strong> {vendor.gstno}</p>
        <p className="mb-3"><strong>Phone:</strong> {vendor.phone}</p>

        
      </div>
    </div>
  );
};

export default VendorDetails;
