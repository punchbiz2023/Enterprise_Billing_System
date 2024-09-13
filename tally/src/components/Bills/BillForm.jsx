// BillForm.jsx
import React, { useState } from 'react';

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
    <div className="p-8 bg-white rounded-lg shadow-lg max-w-4xl mx-auto mt-12">
      <h2 className="text-2xl font-bold mb-6">New Bill</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="font-medium">Vendor Name*</label>
          <select
            className="border p-2 rounded-md"
            value={formData.vendorName}
            onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
          >
            <option>Select a Vendor</option>
            {/* Add vendor options here */}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="font-medium">Bill*</label>
          <input
            type="text"
            className="border p-2 rounded-md"
            value={formData.billNumber}
            onChange={(e) => setFormData({ ...formData, billNumber: e.target.value })}
          />
        </div>

        <div className="flex flex-col">
          <label className="font-medium">Order Number</label>
          <input
            type="text"
            className="border p-2 rounded-md"
            value={formData.orderNumber}
            onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
          />
        </div>

        <div className="flex flex-col">
          <label className="font-medium">Bill Date*</label>
          <input
            type="date"
            className="border p-2 rounded-md"
            value={formData.billDate}
            onChange={(e) => setFormData({ ...formData, billDate: e.target.value })}
          />
        </div>

        <div className="flex flex-col">
          <label className="font-medium">Due Date</label>
          <input
            type="date"
            className="border p-2 rounded-md"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          />
        </div>

        <div className="flex flex-col">
          <label className="font-medium">Payment Terms</label>
          <select
            className="border p-2 rounded-md"
            value={formData.paymentTerms}
            onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
          >
            <option>Due On Receipt</option>
            <option>Net 30</option>
            <option>Net 60</option>
            
            
          </select>
        </div>

        <div className="col-span-5 flex flex-col">
          <label className="font-medium">Subject</label>
          <input
            type="text"
            className="border p-2 rounded-md"
            maxLength="250"
            placeholder="Enter a subject within 250 characters"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          />
        </div>
      </div>

      {/* Item Table */}
      <div className="mt-8">
        <h3 className="text-xl font-medium mb-4">Item Table</h3>
        <div className="overflow-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left">
                <th className="border-b p-2">Item Details</th>
                <th className="border-b p-2">Account</th>
                <th className="border-b p-2">Quantity</th>
                <th className="border-b p-2">Rate</th>
                <th className="border-b p-2">Customer Details</th>
                <th className="border-b p-2">Amount</th>
                <th className="border-b p-2"></th>
              </tr>
            </thead>
            <tbody>
              {formData.items.map((item, index) => (
                <tr key={index}>
                  <td className="border-t p-2">
                    <input
                      type="text"
                      name="itemDetails"
                      className="border p-2 w-full"
                      value={item.itemDetails}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  </td>
                  <td className="border-t p-2">
                    <input
                      type="text"
                      name="account"
                      className="border p-2 w-full"
                      value={item.account}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  </td>
                  <td className="border-t p-2">
                    <input
                      type="number"
                      name="quantity"
                      className="border p-2 w-full"
                      value={item.quantity}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  </td>
                  <td className="border-t p-2">
                    <input
                      type="number"
                      name="rate"
                      className="border p-2 w-full"
                      value={item.rate}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  </td>
                  <td className="border-t p-2">
                    <input
                      type="text"
                      name="customerDetails"
                      className="border p-2 w-full"
                      value={item.customerDetails}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  </td>
                  <td className="border-t p-2">{item.amount}</td>
                  <td className="border-t p-2">
                    <button
                      className="text-red-500"
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
          className="mt-4 p-2 bg-blue-500 text-white rounded-md"
          onClick={handleAddRow}
        >
          Add New Row
        </button>
      </div>

      {/* Total Section */}
      <div className="mt-8 grid grid-cols-2 gap-4">
        <div>
          <label className="font-medium">Sub Total</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={formData.subTotal}
            readOnly
          />
        </div>
        <div>
          <label className="font-medium">Discount</label>
          <input
            type="number"
            className="border p-2 w-full"
            value={formData.discount}
            onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
          />
        </div>

        <div>
          <label className="font-medium">Tax</label>
          <select
            className="border p-2 w-full"
            value={formData.tax}
            onChange={(e) => setFormData({ ...formData, tax: e.target.value })}
          >
            <option value="TDS">TDS</option>
            <option value="TCS">TCS</option>
          </select>
        </div>
        <div>
          <label className="font-medium">Adjustment</label>
          <input
            type="number"
            className="border p-2 w-full"
            value={formData.adjustment}
            onChange={(e) => setFormData({ ...formData, adjustment: e.target.value })}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-8">
       
        <button className="p-2 bg-blue-500 text-white rounded-md">Save</button>
        <button className="p-2 bg-red-500 text-white rounded-md">Cancel</button>
      </div>
    </div>
  );
};

export default BillForm;
