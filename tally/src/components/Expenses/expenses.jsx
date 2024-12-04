import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import SidePanel from '../Purchase/Sidepanel';
import * as XLSX from 'xlsx';

const ExpenseForm = () => {
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [expenseRows, setExpenseRows] = useState([{ id: 1 }]);
  const [vendors, setVendors] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [customer, setCustomer] = useState([]);

  const navigate = useNavigate();

  const [loggedUser, setLoggedUser] = useState(null);

  useEffect(() => {
    if (loggedUser) {
      fetchVendors(loggedUser);
      fetchCustomers(loggedUser);
    }
}, [loggedUser]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    const decoded = jwtDecode(token)
    setLoggedUser(decoded.email)
  }, []);

  const fetchVendors = async (loggedUser) => {
    try {
      const response = await axios.get('https://enterprisebillingsystem.onrender.com/api/vendor',{
        params:{loggedUser}
      });
      if (response.data) {
        setVendors(response.data);
        setDataLoaded(true);
      }
    } catch (error) {
      console.error('Error fetching vendor data:', error.response ? error.response.data : error.message);
    }
  };

  const fetchCustomers = async (loggedUser) => {
    try {
      const response = await axios.get('https://enterprisebillingsystem.onrender.com/api/customers',{
        params:{loggedUser}
      });
      if (response.data) {
        setCustomer(response.data);
        setDataLoaded(true);
      }
    } catch (error) {
      console.error('Error fetching customer data:', error.response ? error.response.data : error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value === 'new vendor') {
      navigate('/dashboard/purchase/vendors/form');
    }
  };

  // Toggle between normal expense and bulk add expense
  const toggleBulkMode = () => {
    setIsBulkMode(!isBulkMode);
  };

  // Add new expense row
  const addNewRow = () => {
    setExpenseRows([
      ...expenseRows,
      { id: expenseRows.length + 1, date: '', expenseAccount: '', amount: '', paidThrough: '', vendor: '', customerName: '', project: '', billable: false },
    ]);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
      const rows = sheet.slice(1).map((row) => ({
        date: row[0],
        expenseAccount: row[1],
        amount: row[2],
        paidThrough: row[3],
        vendor: row[4],
        customerName: row[5],
        project: row[6],
        billable: row[7] === 'Yes',
      }));
      setExpenseRows(rows);
    };
    reader.readAsBinaryString(file);
  };

  // Update specific expense row
  const handleRowChange = (index, field, value) => {
    const updatedRows = [...expenseRows];
    updatedRows[index][field] = value;
    setExpenseRows(updatedRows);
  };

  return (
    <div className='flex'>
      <div className="w-1/5">
        <SidePanel />
      </div>
      <div className="w-full mx-auto p-6 mt-20 bg-white shadow-md rounded-lg">
        <div className="border-b-2 pb-4 flex justify-between">
          <h2 className="text-xl font-semibold">
            {isBulkMode ? 'Bulk Add Expenses' : 'Record Expense'}
          </h2>
          <button
            onClick={toggleBulkMode}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700"
          >
            {isBulkMode ? 'Switch to Single Expense' : 'Bulk Add Expenses'}
          </button>
        </div>

        {/* Single Expense Form */}
        {!isBulkMode ? (
          <div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Date*</label>
              <input
                type="date" required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Expense Account*</label>
              <select required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
                <option>#Select an account#</option>
                <option>Cost of Goods Sold</option>
                <option>Job costing</option>
                <option>Labour</option>
                <option>Materials</option>
              </select>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Amount*</label>
              <div className="flex">
                <select className="p-2 border border-gray-300 rounded-l-md">
                  <option>INR</option>
                </select>
                <input
                  type="text"
                  className="flex-grow p-2 border border-l-0 border-gray-300 rounded-r-md"
                  placeholder="Amount" required
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700" >Paid Through*</label>
              <select className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
                <option>Select an account</option>
                <option>Petty Cash</option>
                <option>Fixed Asset</option>
                <option>Equity</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Vendor</label>
                <select
                  name='vendorName'
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  onChange={handleChange}
                  required
                >
                  <option value="" hidden>--Select a Vendor--</option>
                  <option value='new vendor' className='text-blue-500'>Add new Vendor</option>
                  {vendors.map((vend) => (
                    <option key={vend.id} value={vend.name}>
                      {vend.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Invoice#</label>
                <input
                  type="text"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Invoice" required
                />
              </div>
            </div>
            {/* Notes */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                rows="3"
                placeholder="Max. 500 characters"
              ></textarea>
            </div>
            {/* Upload Receipt */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Upload Receipt</label>
              <div className="mt-1 flex justify-center p-6 border-2 border-dashed border-gray-300 rounded-md">
                <div className="text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L12 12M12 12l6 6M12 12v12M6 30L12 24M12 24l6 6M12 24v12M18 36v12"
                    />
                  </svg>
                  <p className="text-sm text-gray-500">
                    Drag or drop your Receipts
                  </p>
                  <p className="text-xs text-gray-500">Maximum file size allowed is 10MB</p>
                  <input type="file" className="mt-2" />
                </div>
              </div>
            </div>
            {/* Buttons */}
            <div className="mt-6 flex space-x-4">
              <button
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 focus:outline-none"
              >
                Save
              </button>

              <button
                className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md shadow hover:bg-red-700 focus:outline-none"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* File Upload Input */}
            <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="mb-4" />

            <table className="w-full border-collapse border border-gray-300 mt-4">
              <thead>
                <tr>
                  <th className="border p-2">Date</th>
                  <th className="border p-2">Expense Account</th>
                  <th className="border p-2">Amount</th>
                  <th className="border p-2">Paid Through</th>
                  <th className="border p-2">Vendor</th>
                  <th className="border p-2">Customer Name</th>
                  <th className="border p-2">Projects</th>
                  <th className="border p-2">Billable</th>
                </tr>
              </thead>
              <tbody>
                {expenseRows.map((row, index) => (
                  <tr key={index}>
                    <td className="border p-2">
                      <input
                        type="text"
                        value={row.date}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        onChange={(e) => handleRowChange(index, 'date', e.target.value)}
                      />
                    </td>
                    <td className="border p-2">
                      <select
                        value={row.expenseAccount}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        onChange={(e) => handleRowChange(index, 'expenseAccount', e.target.value)}
                      >
                        <option>Select an account</option>
                        <option>Cost of Goods Sold</option>
                        <option>Job costing</option>
                        <option>Labour</option>
                        <option>Materials</option>
                      </select>
                    </td>
                    <td className="border p-2">
                      <div className="flex">
                        <select className="p-2 border border-gray-300 rounded-l-md">
                          <option>INR</option>
                        </select>
                        <input
                          type="text"
                          value={row.amount}
                          className="w-full p-2 border border-l-0 rounded-r-md"
                          onChange={(e) => handleRowChange(index, 'amount', e.target.value)}
                        />
                      </div>
                    </td>
                    <td className="border p-2">
                      <select
                        value={row.paidThrough}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        onChange={(e) => handleRowChange(index, 'paidThrough', e.target.value)}
                      >
                        <option>Select an account</option>
                        <option>Petty Cash</option>
                        <option>Fixed Asset</option>
                        <option>Equity</option>
                      </select>
                    </td>
                    <td className="border p-2">
                      <input
                        type="text"
                        value={row.vendor}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        onChange={(e) => handleRowChange(index, 'vendor', e.target.value)}
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="text"
                        value={row.customerName}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        onChange={(e) => handleRowChange(index, 'customerName', e.target.value)}
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="text"
                        value={row.project}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        onChange={(e) => handleRowChange(index, 'project', e.target.value)}
                      />
                    </td>
                    <td className="border p-2 text-center">
                      <input
                        type="checkbox"
                        checked={row.billable}
                        className="w-5 h-5"
                        onChange={(e) => handleRowChange(index, 'billable', e.target.checked)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              onClick={addNewRow}
              className="mt-4 px-4 py-2 bg-green-600 text-white font-semibold rounded-md shadow hover:bg-green-700"
            >
              Add New Row
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseForm;
