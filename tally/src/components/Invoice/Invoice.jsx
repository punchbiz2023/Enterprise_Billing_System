import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';
import SidePanel from '../Sales/Sidepanel';


const Invoice = () => {
  const [invoice, setInvoice] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState([]);
  const [showCheckboxes, setShowCheckboxes] = useState(false); // State to toggle checkboxes
  const [searchTerm, setSearchTerm] = useState('');
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
  }, []);

  const fetchInvoice = async (loggedUser) => {
    try {
      const response = await axios.get('https://enterprisebillingsystem.onrender.com/api/invoice',{
        params:{loggedUser}
      });
      if (response.data) {
        setInvoice(response.data);
        setDataLoaded(true);
      }
    } catch (error) {
      console.error('Error fetching invoice data:', error.response ? error.response.data : error.message);
    }
  };

  const handleCheckboxChange = (invoiceId) => {
    setSelectedInvoice(prevSelected =>
      prevSelected.includes(invoiceId)
        ? prevSelected.filter(id => id !== invoiceId)
        : [...prevSelected, invoiceId]
    );
  };

  const handleDelete = async () => {
    if (selectedInvoice.length <= 0) return;

    try {
      await axios.delete('https://enterprisebillingsystem.onrender.com/api/invoice', { data: { ids: selectedInvoice } });
      fetchInvoice(loggedUser);
      setSelectedInvoice([]);
      setShowCheckboxes(false); // Hide checkboxes after deletion
    } catch (error) {
      console.error('Error deleting invoice:', error.response ? error.response.data : error.message);
    }
  };

  const filteredInvoice = invoice.filter(inv =>
    inv.name.toLowerCase().startsWith(searchTerm.toLowerCase())
  );
  

  return (
    <div className="flex">
      <div className="w-1/5">
        <SidePanel />
      </div>
      <div className="w-4/5 p-6 mt-[4%] mr-[10%]">
        <h1 className="text-xl font-bold mb-4">Invoice List</h1>

        <div className="flex justify-between mb-4">
          {/* Search bar on the left */}
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-100 px-4 py-2 border border-gray-600 rounded w-1/3"
          />

          {/* Buttons on the right */}
          <div className="flex space-x-4">
            <Link
              to="/dashboard/sales/invoice/form"
              className="inline-block px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Invoice
            </Link>
            <button
              onClick={() => {
                setShowCheckboxes(!showCheckboxes);
                if (showCheckboxes) {
                  setSelectedInvoice([]); // Unselect all checkboxes when 'Cancel' is clicked
                }
              }}
              className={`inline-block px-5 py-2 rounded text-white ${showCheckboxes ? 'bg-gray-500 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'}`}
            >
              {showCheckboxes ? 'Cancel' : 'Delete Invoice'}
            </button>
            {showCheckboxes && selectedInvoice.length > 0 && (
              <button
                onClick={handleDelete}
                className="inline-block px-5 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border-b"></th>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Due Date</th>
                <th className="py-2 px-4 border-b">Tax Type</th>
                <th className="py-2 px-4 border-b">GST</th>
                <th className="py-2 px-4 border-b">Amount Recieved </th>
              </tr>
            </thead>
            <tbody>
              {!dataLoaded ? (
                <tr>
                  <td colSpan="7" className="py-2 px-4 text-center text-gray-500">
                    Loading Invoices...
                  </td>
                </tr>
              ) : filteredInvoice.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-2 px-4 text-center text-gray-500">
                    No Invoice found
                  </td>
                </tr>
              ) : (
                filteredInvoice.map((invoice, index) => (
                  <tr key={invoice.sno || index} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b">
                      {showCheckboxes && (
                        <input
                          type="checkbox"
                          className="form-checkbox"
                          onChange={() => handleCheckboxChange(invoice.sno)}
                          checked={selectedInvoice.includes(invoice.sno)}
                        />
                      )}
                    </td>
                    <td className="py-2 px-4 text-center border-b">
                        <Link to={`/dashboard/sales/invoice/${invoice.sno}` }className="text-blue-500 hover:underline">{invoice.name}</Link>
                    </td>
                    <td className="py-2 px-4 text-center border-b">{invoice.duedate}</td>
                    <td className="py-2 px-4 text-center border-b">{invoice.taxtype}</td>
                    <td className="py-2 px-4 text-center border-b">{invoice.taxrate}</td>
                    <td className="py-2 px-4 text-center border-b">{invoice.amount}</td>
                    
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Invoice
