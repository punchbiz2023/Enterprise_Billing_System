import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const EstimateDetails = () => {
  const { id } = useParams(); // Captures the id from the URL
  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggedUser, setLoggedUser] = useState(null);

  useEffect(() => {
    if (loggedUser) {
      fetchEstimate(loggedUser);
    }
}, [loggedUser]);
  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    const decoded = jwtDecode(token)
    
    setLoggedUser(decoded.email); 
    
  }, [id]);
  const fetchEstimate = async (loggedUser) => {
    try {
      const response = await axios.get('https://enterprisebillingsystem.onrender.com/api/estimates',{
        params:{loggedUser}
      });
      // Find the estimate based on the ID from the params
      const fetchedEstimate = response.data.find(estimate => estimate.sno === parseInt(id));

      setEstimate(fetchedEstimate);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching estimate details:', error.response ? error.response.data : error.message);
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500 text-lg">Loading...</p>;
  }

  if (!estimate) {
    return <p className="text-center text-red-500 text-lg">Estimate not found</p>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 p-4 mt-10">
      <div className="bg-white shadow-xl p-8 rounded-lg max-w-4xl w-full border border-gray-200">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Estimate Details</h1>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-lg"><span className="font-semibold text-gray-700">Customer Name:</span> {estimate.cname || 'None'}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Quote Number:</span> {estimate.quotenum || 'None'}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Reference Number:</span> {estimate.refnum || 'None'}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Quote Date:</span> {estimate.qdate || 'None'}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Expiry Date:</span> {estimate.expdate || 'None'}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Project:</span> {estimate.project || 'None'}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Subject:</span> {estimate.subject || 'None'}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Salesperson:</span> {estimate.salesperson || 'None'}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Tax Type:</span> {estimate.taxtype || 'None'}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Tax Rate:</span> {estimate.taxrate || 'None'}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Total:</span> {estimate.total || 'None'}</p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Item Details</h2>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-300 space-y-4">
              {estimate.itemtable.map((item, index) => (
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

export default EstimateDetails;
