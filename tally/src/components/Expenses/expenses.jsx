import React, { useState } from 'react';

const ExpenseForm = () => {
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [expenseRows, setExpenseRows] = useState([{ id: 1 }]);

  // Toggle between normal expense and bulk add expense
  const toggleBulkMode = () => {
    setIsBulkMode(!isBulkMode);
  };
  // Add new expense row
  const addNewRow = () => {
    setExpenseRows([...expenseRows, { id: expenseRows.length + 1 }]); // Add new row
  };

  return (
    <div className="max-w-5xl mx-auto p-6 mt-20 bg-white shadow-md rounded-lg">
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

      {/* Toggle between forms */}
      {!isBulkMode ? (
        // Single Expense Form
        <div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Date*</label>
            <input
              type="date"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Expense Account*</label>
            <select className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
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
                placeholder="Amount"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Paid Through*</label>
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
          <input
            type="text"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Vendor"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Invoice#</label>
          <input
            type="text"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Invoice"
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
       {/* Customer Name */}
       <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Customer Name</label>
        <select className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
          <option>Select or add a customer</option>
        </select>
      </div>
       {/* Buttons */}
       <div className="mt-6 flex space-x-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 focus:outline-none"
        >
          Save (alt+s)
        </button>
        <button
          className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-md shadow hover:bg-gray-700 focus:outline-none"
        >
          Save and New (alt+n)
        </button>
        <button
          className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md shadow hover:bg-red-700 focus:outline-none"
        >
          Cancel
        </button>
      </div>


          {/* Other fields and buttons */}
        </div>
      ) : (
        // Bulk Add Expenses Form
        <div>
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
                    <input type="date" className="w-full p-2 border border-gray-300 rounded-md" />
                  </td>
                  <td className="border p-2">
                    <select className="w-full p-2 border border-gray-300 rounded-md">
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
                      <input type="text" className="w-full p-2 border border-l-0 rounded-r-md" />
                    </div>
                  </td>
                  <td className="border p-2">
                    <select className="w-full p-2 border border-gray-300 rounded-md">
                      <option>Select an account</option>
                      <option>Petty Cash</option>
              <option>Fixed Asset</option>
              <option>Equity</option>
                    </select>
                  </td>
                  <td className="border p-2">
                    <input type="text" className="w-full p-2 border border-gray-300 rounded-md" />
                  </td>
                  <td className="border p-2">
                    <select className="w-full p-2 border border-gray-300 rounded-md">
                      <option>Select customer</option>
                    </select>
                  </td>
                  <td className="border p-2">
                    <select className="w-full p-2 border border-gray-300 rounded-md">
                      <option>Select project</option>
                    </select>
                  </td>
                  <td className="border p-2 text-center">
                    <input type="checkbox" className="form-checkbox" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Option to add more expenses */}
          <button className="mt-4 px-4 py-2 bg-green-600 text-white font-semibold rounded-md"  onClick={addNewRow}>
            + Add More Expenses
          </button>
        </div>
      )}
    </div>
  );
};

export default ExpenseForm;
