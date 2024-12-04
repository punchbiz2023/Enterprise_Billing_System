import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SidePanel from '../Sales/Sidepanel';
import { jwtDecode } from 'jwt-decode';

const Delivery = () => {
  const [items, setItems] = useState([{ name: '', quantity: 1, rate: '', discount: '', amount: 0 }]);
  const [customers, setCustomers] = useState([]);
  const [customer, setCustomer] = useState('');
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);

  
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    
    // Calculate amount based on the current state of item
    const item = newItems[index];
    const calculatedAmount = (item.quantity * item.rate) - ((item.quantity * item.rate) * item.discount / 100);
    newItems[index].amount = calculatedAmount >= 0 ? calculatedAmount : 0;  // Ensure amount never goes negative
    
    setItems(newItems);
    updateTotal(newItems); // Update total when any item changes
  };
  
  const updateTotal = (items) => {
    const newTotal = items.reduce((acc, curr) => acc + curr.amount, 0);
    setTotal(newTotal);
  };
  const [loggedUser, setLoggedUser] = useState(null);
  
  useEffect(() => {
    if (loggedUser) {
      fetchCustomers(loggedUser);
    }
}, [loggedUser]);
  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    const decoded = jwtDecode(token)
    
    setLoggedUser(decoded.email);  
    
  }, []);
  const fetchCustomers = async (loggedUser) => {
    try {
      const response = await axios.get('https://enterprisebillingsystem.onrender.com/api/customers',{
        params:{loggedUser}
      });
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customer data:', error);
    }
  };

  const addRow = () => {
    setItems([...items, { name: '', quantity: 1, rate: '', discount: '', amount: 0 }]);
  };

  return (
    <div className='flex'>
      <div className="w-1/5">
        <SidePanel />
      </div>
      <div className="container mt-12 mx-auto p-4">
        <h2 className="text-2xl font-bold mt-5 mb-4">New Delivery Challan</h2>

        <form>
          {/* Customer Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Customer Name*</label>
            <div>
              <select
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-full focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a customer</option>
                {customers.map((cust) => (
                  <option key={cust.id} value={cust.name}>{cust.name}</option>
                ))}
                <option value="new sales/customers">Add New Customer</option>
              </select>
            </div>
          </div>

          {/* Delivery Challan # and Reference # */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium">Delivery Challan#*</label>
              <input type="text" placeholder='Enter delivery challan number' required className="border border-gray-300 rounded-md p-2 w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium">Reference#</label>
              <input type="text" placeholder='Enter Reference id' required className="border border-gray-300 rounded-md p-2 w-full" />
            </div>
          </div>

          {/* Delivery Challan Date */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Delivery Challan Date*</label>
            <input type="date" className="border border-gray-300 rounded-md p-2 w-full" />
          </div>

          {/* Challan Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Challan Type*</label>
            <select className="border border-gray-300 rounded-md p-2 w-full">
              <option value="">Choose a proper challan type</option>
              <option value="Job Work">Job Work</option>
              <option value="Supply of liquid gas">Supply of liquid gas</option>
              <option value="Supply on Approval">Supply on Approval</option>
              <option value="Others">Others</option>
            </select>
          </div>

          {/* Item Table */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-2">Item Table</h3>
            <table className="table-auto w-full text-left border border-gray-300">
              <thead>
                <tr className="border-b">
                  <th className="p-2">Item Details</th>
                  <th className="p-2">Quantity</th>
                  <th className="p-2">Rate</th>
                  <th className="p-2">Discount</th>
                  <th className="p-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">
                      <input
                        type="text"
                        className="border border-gray-300 rounded-md p-2 w-full"
                        value={item.name}
                        onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        className="border border-gray-300 rounded-md p-2 w-full"
                        value={item.quantity}
                        min="0"
                        onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        className="border border-gray-300 rounded-md p-2 w-full"
                        value={item.rate}
                        min="0"
                        onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value))}
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        className="border border-gray-300 rounded-md p-2 w-full"
                        value={item.discount}
                        min="0"
                        onChange={(e) => handleItemChange(index, 'discount', parseFloat(e.target.value) || 0)}
                      />
                    </td>
                    <td className="p-2">{item.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              type="button"
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
              onClick={addRow}
            >
              Add New Row
            </button>
          </div>

          {/* Total */}
          <div className="flex justify-end mb-4">
            <div>
              <span className="block text-lg font-bold">Total (₹)</span>
              <input type="text" className="border border-gray-300 rounded-md p-2 w-32 text-right" readOnly value={total.toFixed(2)} />
            </div>
          </div>

          {/* Customer Notes */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Customer Notes</label>
            <textarea placeholder='Add notes here' className="border border-gray-300 rounded-md p-2 w-full"></textarea>
          </div>

          {/* Terms & Conditions */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Terms & Conditions</label>
            <textarea placeholder='Enter terms and conditions here' required className="border border-gray-300 rounded-md p-2 w-full"></textarea>
          </div>

          {/* Upload Files */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Attach File(s) to Delivery Challan</label>
            <input type="file" className="border border-gray-300 rounded-md p-2 w-full" />
          </div>

          {/* Submit Button */}
          <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-md">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Delivery;
