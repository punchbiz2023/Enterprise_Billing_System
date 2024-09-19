// BillForm.jsx
import React, { useState } from 'react';
import SidePanel from '../Purchase/SidePanel';

const BillForm = () => {
  const [formData, setFormData] = useState({
    vendorName: '',
    billNumber: '',
    orderNumber: '',
    billDate: '',
    dueDate: '',
    paymentTerms: '',
    subject: '',
    items: [{ itemDetails: '', account: '', quantity: '', rate: '', customerDetails: '', amount: 0 }],
    subTotal: 0,
    discount: 0,
    tax: 'TDS',
    adjustment: 0,
  });

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedItems = [...formData.items];
    updatedItems[index][name] = value;
    setFormData({ ...formData, items: updatedItems });
  };

  const handleAddRow = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { itemDetails: '', account: '', quantity: '', rate: '', customerDetails: '', amount: 0 }],
    });
  };

  return (
    <div className='flex'>
      <div className="w-1/5">
                <SidePanel />
            </div>
    <div className="p-10 bg-white rounded-lg shadow-xl max-w-7xl mx-auto mt-12">
      <h2 className="text-3xl font-semibold mb-8 text-gray-800">New Bill</h2>

      <div className="grid grid-cols-2 gap-8">
        <div className="flex flex-col">
          <label className="font-semibold text-gray-700">Vendor Name*</label>
          <select
            className="border border-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.vendorName}
            onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
          >
            <option>Select a Vendor</option>
            {/* Add vendor options here */}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="font-semibold text-gray-700">Bill*</label>
          <input
            type="text"
            className="border border-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.billNumber}
            onChange={(e) => setFormData({ ...formData, billNumber: e.target.value })}
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold text-gray-700">Order Number</label>
          <input
            type="text"
            className="border border-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.orderNumber}
            onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold text-gray-700">Bill Date*</label>
          <input
            type="date"
            className="border border-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.billDate}
            onChange={(e) => setFormData({ ...formData, billDate: e.target.value })}
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold text-gray-700">Due Date</label>
          <input
            type="date"
            className="border border-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold text-gray-700">Payment Terms</label>
          <select
            className="border border-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.paymentTerms}
            onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
          >
            <option>Due On Receipt</option>
            <option>Net 30</option>
            <option>Net 60</option>
          </select>
        </div>

        <div className="col-span-2 flex flex-col">
          <label className="font-semibold text-gray-700">Subject</label>
          <input
            type="text"
            className="border border-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength="250"
            placeholder="Enter a subject within 250 characters"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          />
        </div>
      </div>

      {/* Item Table */}
      <div className="mt-10">
        <h3 className="text-2xl font-medium text-gray-800 mb-6">Item Table</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border-b p-4 font-medium text-left">Item Details</th>
                <th className="border-b p-4 font-medium text-left">Account</th>
                <th className="border-b p-4 font-medium text-left">Quantity</th>
                <th className="border-b p-4 font-medium text-left">Rate</th>
                <th className="border-b p-4 font-medium text-left">Customer Details</th>
                <th className="border-b p-4 font-medium text-left">Amount</th>
                <th className="border-b p-4"></th>
              </tr>
            </thead>
            <tbody>
              {formData.items.map((item, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border-t p-3">
                    <input
                      type="text"
                      name="itemDetails"
                      className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={item.itemDetails}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  </td>
                  <td className="border-t p-3">
                    <input
                      type="text"
                      name="account"
                      className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={item.account}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  </td>
                  <td className="border-t p-3">
                    <input
                      type="number"
                      name="quantity"
                      className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={item.quantity}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  </td>
                  <td className="border-t p-3">
                    <input
                      type="number"
                      name="rate"
                      className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={item.rate}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  </td>
                  <td className="border-t p-3">
                    <input
                      type="text"
                      name="customerDetails"
                      className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={item.customerDetails}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  </td>
                  <td className="border-t p-3">{item.amount}</td>
                  <td className="border-t p-3">
                    <button
                      className="text-red-500 hover:text-red-600 focus:outline-none"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          items: formData.items.filter((_, i) => i !== index),
                        })
                      }
                    >
                      X
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          className="mt-6 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg focus:outline-none transition-all"
          onClick={handleAddRow}
        >
          Add New Row
        </button>
      </div>

      {/* Total Section */}
      <div className="mt-10 grid grid-cols-2 gap-8">
        <div>
          <label className="font-semibold text-gray-700">Sub Total</label>
          <input
            type="text"
            className="border border-gray-400 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.subTotal}
            readOnly
          />
        </div>
        <div>
          <label className="font-semibold text-gray-700">Discount</label>
          <input
            type="number"
            className="border border-gray-400 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.discount}
            onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
          />
        </div>
        <div>
          <label className="font-semibold text-gray-700">Tax</label>
          <select
            className="border border-gray-400 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.tax}
            onChange={(e) => setFormData({ ...formData, tax: e.target.value })}
          >
            <option value="TDS">TDS</option>
            <option value="TCS">TCS</option>
          </select>
        </div>
        <div>
          <label className="font-semibold text-gray-700">Adjustment</label>
          <input
            type="number"
            className="border border-gray-400 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.adjustment}
            onChange={(e) => setFormData({ ...formData, adjustment: e.target.value })}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-10">
        <button className="p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg focus:outline-none transition-all">
          Save
        </button>
        <button className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-lg focus:outline-none transition-all">
          Cancel
        </button>
      </div>
    </div>
    </div>

  );
};

export default BillForm;
