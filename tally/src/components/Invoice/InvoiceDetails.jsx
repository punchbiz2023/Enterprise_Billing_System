import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const InvoiceDetails = () => {
  const { id } = useParams(); // Capture the id from the URL
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggedUser, setLoggedUser] = useState(null);

  useEffect(() => {
    if (loggedUser) {
      fetchInvoice(loggedUser);
    }
  }, [loggedUser]);
  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    const decoded = jwtDecode(token)

    setLoggedUser(decoded.email);


  }, [id]);
  const fetchInvoice = async (loggedUser) => {
    try {
      const response = await axios.get('https://enterprisebillingsystem.onrender.com/api/invoice', {
        params: { loggedUser }
      });
      const fetchedInvoice = response.data.find(invoice => invoice.sno === parseInt(id));

      setInvoice(fetchedInvoice);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching invoice details:', error.response ? error.response.data : error.message);
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500 text-lg">Loading...</p>;
  }

  if (!invoice) {
    return <p className="text-center text-red-500 text-lg">Invoice not found</p>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 p-4 mt-10">
      <div className="bg-white shadow-xl p-8 rounded-lg max-w-4xl w-full border border-gray-200">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Invoice Details</h1>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-lg"><span className="font-semibold text-gray-700">Invoice ID:</span> {invoice.invoiceid}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Name:</span> {invoice.name}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">State:</span> {invoice.state}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Phone:</span> {invoice.phone}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Email:</span> {invoice.mail}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Invoice Date:</span> {invoice.invdate}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Due Date:</span> {invoice.duedate}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Terms:</span> {invoice.terms}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Subject:</span> {invoice.subject}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Salesperson:</span> {invoice.salesperson}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Tax Type:</span> {invoice.taxtype}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Tax Rate:</span> {invoice.taxrate}</p>
              <p className="text-lg"><span className="font-semibold text-gray-700">Amount:</span> {invoice.amount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;
