import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const CreditDetails = () => {
  const { id } = useParams(); // Captures the id from the URL
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggedUser, setLoggedUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    const decoded = jwtDecode(token)

    setLoggedUser(decoded.email);

  }, [id]);
  useEffect(() => {
    if (loggedUser) {
      fetchNote(loggedUser);
    }
  }, [loggedUser]);
  const fetchNote = async () => {
    try {
      const response = await axios.get(`https://enterprisebillingsystem.onrender.com/api/creditnote`, {
        params: { loggedUser }
      });

      // Find the note based on the ID from the params
      const fetchedNote = response.data.find(note => note.sno === parseInt(id));

      setNote(fetchedNote);
      setLoading(false);

    } catch (error) {
      console.error('Error fetching note details:', error.response ? error.response.data : error.message);
      setLoading(false);
    }
  };


  if (loading) {
    return <p className="text-center text-gray-500 text-lg">Loading...</p>;
  }

  if (!note) {
    return <p className="text-center text-red-500 text-lg">Note not found</p>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-xl p-6 rounded-lg w-full max-w-5xl border border-gray-200">
        <h1 className="text-3xl font-semibold mb-6 mt-16  text-center text-gray-800">Note Details</h1>

        {/* note Information Table */}
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
              <td className="py-3 px-4 border-b border-gray-300">{note.name || 'None'}</td>
            </tr>
            <tr>
              <td className="py-3 px-4 border-b border-gray-300">Note Number</td>
              <td className="py-3 px-4 border-b border-gray-300">{note.creditno || 'None'}</td>
            </tr>
            <tr>
              <td className="py-3 px-4 border-b border-gray-300">Reference Number</td>
              <td className="py-3 px-4 border-b border-gray-300">{note.refno || 'None'}</td>
            </tr>

            <tr>
              <td className="py-3 px-4 border-b border-gray-300">Note Date</td>
              <td className="py-3 px-4 border-b border-gray-300">{note.creditdate || 'None'}</td>
            </tr>

            <tr>
              <td className="py-3 px-4 border-b border-gray-300">Subject</td>
              <td className="py-3 px-4 border-b border-gray-300">{note.subject || 'None'}</td>
            </tr>
            <tr>
              <td className="py-3 px-4 border-b border-gray-300">Terms</td>
              <td className="py-3 px-4 border-b border-gray-300">{note.terms || 'None'}</td>
            </tr>
            <tr>
              <td className="py-3 px-4 border-b border-gray-300">Salesperson</td>
              <td className="py-3 px-4 border-b border-gray-300">{note.salesperson || 'None'}</td>
            </tr>
            <tr>
              <td className="py-3 px-4 border-b border-gray-300">Tax</td>
              <td className="py-3 px-4 border-b border-gray-300">{note.taxrate || 'None'}</td>
            </tr>
            <tr>
              <td className="py-3 px-4 border-b border-gray-300">Total</td>
              <td className="py-3 px-4 border-b border-gray-300">{note.amount || 'None'}</td>
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
            {note.itemdetails.length > 0 ? (
              note.itemdetails.map((item, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="py-3 px-4 border-b border-gray-300">{index + 1}</td>
                  <td className="py-3 px-4 border-b border-gray-300">{item.item || 'None'}</td>
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

export default CreditDetails;
