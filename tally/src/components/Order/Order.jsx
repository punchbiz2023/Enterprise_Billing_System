import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Order = () => {
  const [order, setOrder] = useState({
    customerName: '',
    reference: '',
    expectedShipmentDate: '',
    deliveryMethod: '',
    salesperson: '',
  });

  const [rows, setRows] = useState([
    { itemDetails: '', quantity: '1.00', rate: '0.00', discount: '0', amount: '0.00' },
  ]);
  const navigate = useNavigate();

  const [items, setItems] = useState([])
  const [customer, setCustomer] = useState([])
  const [dataLoaded, setDataLoaded] = useState(false);


  useEffect(() => {
    fetchCustomers();
    fetchItems();
  }, [])

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/customers');
      if (response.data) {
        setCustomer(response.data);
        setDataLoaded(true);
        // console.log(response.data);
      }
    } catch (error) {
      console.error('Error fetching customer data:', error.response ? error.response.data : error.message);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/items');
      if (response.data) {
        setItems(response.data);
        setDataLoaded(true);
      }
    } catch (error) {
      console.error('Error fetching Item data:', error.response ? error.response.data : error.message);
    }
  };


  const handleRowChange = (index, e) => {
    const { name, value } = e.target;

    if (value == "new item") {
      navigate('/dashboard/items/form')
    } else {
      const newRows = [...rows];
      newRows[index] = { ...newRows[index], [name]: value };
      setRows(newRows);
    }
  };

  const addNewRow = () => {
    setRows([
      ...rows,
      { itemDetails: '', quantity: '1.00', rate: '0.00', discount: '0', amount: '0.00' },
    ]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (value === 'new customer') {
      navigate('/dashboard/sales/customers/form');
    } else {
      setOrder((prevOrder) => ({
        ...prevOrder,
        [name]: value,
      }));
    }
  };




  return (
    <div className="max-w-5xl mx-auto p-10 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-3xl font-semibold mb-8 text-gray-700">New Sales Order</h2>
      <form className="space-y-6">
        {/* Customer Name */}

        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="text-gray-700 mb-2">Customer Name</label>
            <select
              name="customerName"
              value={order.customerName}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" hidden>--Select a customer--</option>
              <option value='new customer' className='text-blue-500'>Add new Customer</option>
              {customer.map((cust) => (
                <option key={cust.id} value={cust.name}>
                  {cust.name}
                </option>
              ))}

            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 mb-2">Sales Order</label>
            <input
              type="text"
              name="salesOrderNumber"
              value={order.salesOrderNumber}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded-md "
              
            />
          </div>
        </div>

        {/* Reference & Sales Order Date */}
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="text-gray-700 mb-2">Reference</label>
            <input
              type="text"
              name="reference"
              value={order.reference}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 mb-2">Sales Order Date</label>
            <input
              type="date"
              name="salesOrderDate"
              value={order.salesOrderDate}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded-md  cursor-not-allowed"
              readOnly
            />
          </div>
        </div>

        {/* Expected Shipment Date & Payment Terms */}
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="text-gray-700 mb-2">Expected Shipment Date</label>
            <input
              type="date"
              name="expectedShipmentDate"
              value={order.expectedShipmentDate}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 mb-2">Payment Terms</label>
            <select
              name="paymentTerms"
              value={order.paymentTerms}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" hidden>--Payment Terms--</option>
              <option value="Due on Receipt">Due on Receipt</option>
              <option value="Net 30">Net 30</option>
              <option value="Net 60">Net 60</option>
            </select>
          </div>
        </div>

        {/* Delivery Method & Salesperson */}
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="text-gray-700 mb-2">Delivery Method</label>
            <select
              name="deliveryMethod"
              value={order.deliveryMethod}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Select">--Select Delivery Method--</option>
              <option value="Courier">Courier</option>
              <option value="Pickup">Pickup</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 mb-2">Salesperson</label>
            <select
              name="salesperson"
              value={order.salesperson}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select or Add Salesperson</option>
              <option value="John Doe">John Doe</option>
              <option value="Jane Smith">Jane Smith</option>
            </select>
          </div>
        </div>
      </form>

      {/* Item Table */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-6 text-gray-700">Item Table</h3>
        <table className="min-w-full bg-white border border-gray-300 rounded-md">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-gray-600">Item Details</th>
              <th className="px-4 py-2 text-right text-gray-600">Quantity</th>
              <th className="px-4 py-2 text-right text-gray-600">Rate</th>
              <th className="px-4 py-2 text-right text-gray-600">Discount</th>
              <th className="px-4 py-2 text-right text-gray-600">Amount</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td className="px-4 py-2 border-t">
                  <select
                    name="itemDetails"
                    value={row.itemDetails}
                    onChange={(e) => handleRowChange(index, e)}
                    className="border border-gray-300 p-2 w-full rounded-md focus:outline-none"
                  >
                    <option value="" hidden>--Select an item--</option>
                    <option value='new item' className='text-blue-500'>Add new Item</option>

                    {items.map((item) => (
                      <option key={item.id} value={item.name}>
                        {item.name}
                      </option>
                    ))}

                  </select>
                </td>
                <td className="px-4 py-2 border-t text-right">
                  <input
                    type="number"
                    name="quantity"
                    value={row.quantity}
                    onChange={(e) => handleRowChange(index, e)}
                    className="border border-gray-300 p-2 w-16 rounded-md text-right focus:outline-none"
                  />
                </td>
                <td className="px-4 py-2 border-t text-right">
                  <input
                    type="number"
                    name="rate"
                    value={row.rate}
                    onChange={(e) => handleRowChange(index, e)}
                    className="border border-gray-300 p-2 w-20 rounded-md text-right focus:outline-none"
                  />
                </td>
                <td className="px-4 py-2 border-t text-right">
                  <input
                    type="number"
                    name="discount"
                    value={row.discount}
                    onChange={(e) => handleRowChange(index, e)}
                    className="border border-gray-300 p-2 w-16 rounded-md text-right focus:outline-none"
                  />
                </td>
                <td className="px-4 py-2 border-t text-right">
                  <input
                    type="number"
                    name="amount"
                    value={row.amount}
                    onChange={(e) => handleRowChange(index, e)}
                    className="border border-gray-300 p-2 w-20 rounded-md text-right focus:outline-none"
                  />
                </td>
              </tr>
            ))}
          </tbody>

        </table>

        <div className="flex justify-between items-center mt-4">
          <button type="button" onClick={addNewRow} className="text-blue-500 font-semibold hover:text-blue-700 hover:bg-white">
            Add New Row
          </button>
        </div>

        {/* Summary */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-6 text-gray-700">Summary</h3>
          <div className="flex justify-between items-center">
            <div className="text-gray-600">Sub Total</div>
            <div>0.00</div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <div className="text-gray-600">TDS</div>
            <div>- 0.00</div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <div className="text-gray-600">Total</div>
            <div>0.00</div>
          </div>
        </div>

        {/* Notes */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-6 text-gray-700">Notes</h3>
          <textarea
            className="border border-gray-300 p-3 w-full rounded-md focus:outline-none"
            placeholder="Enter any notes to be displayed in your transaction"
          ></textarea>
        </div>

        {/* Terms & Conditions */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-6 text-gray-700">Terms & Conditions</h3>
          <textarea
            className="border border-gray-300 p-3 w-full rounded-md focus:outline-none"
            placeholder="Enter the terms and conditions of your business to be displayed in your transaction"
          ></textarea>
        </div>

        <button
          type="submit"
          className="col-span-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save Order
        </button>
      </div>
    </div>

  );
};

export default Order;
