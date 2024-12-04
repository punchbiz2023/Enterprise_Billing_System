import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'
import SidePanel from '../Sales/Sidepanel';
import { Link, useNavigate } from 'react-router-dom';
const CreditNotes = () => {

  const [salespersons, setSalespersons] = useState([]);
  const [salesperson, setSalesperson] = useState('')
  const [creditNumber, setcreditNumber] = useState('');
  const [customerNotes, setcustomerNotes] = useState('');
  const [terms, setTerms] = useState('');
  const [items, setItems] = useState([{ item: '', HsnCode: '', quantity: '', rate: '', discount: '', gst: '', sgst: '', cgst: '', amount: '' }]);
  const [availableItems, setAvailableItems] = useState([]);
  const [taxType, setTaxType] = useState('');
  const [tax, setTax] = useState(0);
  const [customTax, setCustomTax] = useState('');
  const [adjustment, setAdjustment] = useState(0);
  const [adjustmentType, setAdjustmentType] = useState('add');
  const [showCustomTax, setShowCustomTax] = useState(false);

  const [customers, setCustomers] = useState([]);
  const [customer, setCustomer] = useState('');
  const [customerState, setCustomerState] = useState('');

  const [referenceNumber, setreferenceNumber] = useState('');
  const [creditDate, setcreditDate] = useState('');
  const [subject, setSubject] = useState('');
  const [loggedUser, setLoggedUser] = useState(null);
  
  const navigate = useNavigate();
  useEffect(() => {
    if (loggedUser) {
      fetchCustomers(loggedUser);
      fetchSalespeople(loggedUser);
      fetchItems(loggedUser);
    }
}, [loggedUser]);
  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    const decoded = jwtDecode(token)
    
    setLoggedUser(decoded.email); 
  }, []);
  const fetchSalespeople = async (loggedUser) => {
    try {
      const response = await axios.get('https://enterprisebillingsystem.onrender.com/api/salespersons',{
        params:{loggedUser}
      });
      setSalespersons(response.data);
    } catch (error) {
      console.error('Error fetching salesperson data:', error);
    }
  };


  const fetchCustomers = async (loggedUser) => {
    try {
      const response = await axios.get('https://enterprisebillingsystem.onrender.com/api/customers',{
        params:{loggedUser}
      });
      const customersWithState = response.data.map((cust) => ({
        ...cust,
        state: cust.billaddress.state,
      }));
      setCustomers(customersWithState);
    } catch (error) {
      console.error('Error fetching customer data:', error);
    }
  };
  const handleDropdownChange = (e) => {
    const selectedCustomerName = e.target.value;
    setCustomer(selectedCustomerName);


    const selectedCustomer = customers.find((cust) => cust.name === selectedCustomerName);
    if (selectedCustomer) {
      setCustomerState(selectedCustomer.state);
    } else {
      setCustomerState('');
    }
  };


  const fetchItems = async (loggedUser) => {
    try {
      const response = await axios.get('https://enterprisebillingsystem.onrender.com/api/items',{
        params:{loggedUser}
      });
      setAvailableItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };


  const handleSubmit = async (e) => {

    e.preventDefault();
    // console.log("Items before POST:", items);  // Log the items state

    const creditDetails = {
      name: customer,
      creditno: creditNumber,
      refno: referenceNumber,
      creditdate: creditDate,
      itemdetails: items,
      subject: subject,
      notes: customerNotes,
      terms: terms,
      salesperson: salesperson,
      taxtype: taxType,
      taxrate: tax,
      amount: calculateTotal()
    };
    // console.log("Credit Details before POST:", creditDetails);
    const data = {...creditDetails,loggedUser}

    try {
      const response = await axios.post('https://enterprisebillingsystem.onrender.com/api/creditnote', data);
      // console.log("Post success");

      navigate('/dashboard/sales/credit')
    } catch (error) {
      console.error('Error creating Credit Notes:', error.response ? error.response.data : error.message);
    }
  };


  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    if (field === 'item') {
      const selectedItem = availableItems.find(
        (availableItem) => availableItem.name === value
      );
      if (selectedItem) {
        newItems[index].gst = selectedItem.gst;
      }
    }
    if (['rate', 'HsnCode', 'quantity', 'discount', 'gst', 'sgst', 'cgst', 'igst'].includes(field)) {
      const rate = parseFloat(newItems[index].rate) || 0;
      const HsnCode = parseFloat(newItems[index].HsnCode) || 0;
      const quantity = parseFloat(newItems[index].quantity) || 0;
      const discount = parseFloat(newItems[index].discount) || 0;
      const gst = parseFloat(newItems[index].gst) || 0;
      const sgst = parseFloat(newItems[index].sgst) || 0;
      const cgst = parseFloat(newItems[index].cgst) || 0;
      const igst = parseFloat(newItems[index].igst) || 0;

      const baseAmount = rate * quantity;
      const discountedAmount = baseAmount * (1 - discount / 100);

      let totalAmount = discountedAmount;
      if (customerState === 'Tamil Nadu') {
        const sgstAmount = gst / 2;
        const cgstAmount = gst / 2;
        newItems[index].sgst = sgstAmount.toFixed(2);
        newItems[index].cgst = cgstAmount.toFixed(2);
        newItems[index].igst = '';
        totalAmount = discountedAmount * (1 + sgstAmount / 100 + cgstAmount / 100);
      } else {
        newItems[index].igst = gst;
        totalAmount = discountedAmount * (1 + gst / 100);
      }

      newItems[index].amount = totalAmount.toFixed(2);
    }

    setItems(newItems);
  };

  const addNewItem = () => {
    setItems([...items, { item: '', HsnCode: '', quantity: '', rate: '', discount: '', gst: '', sgst: '', cgst: '', igst: '', amount: '' }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateSubtotal = () => {

    return items.reduce((acc, item) => {
      const rate = parseFloat(item.rate) || 0;
      const quantity = parseFloat(item.quantity) || 0;
      const discount = parseFloat(item.discount) || 0;

      const baseAmount = rate * quantity;
      const discountedAmount = baseAmount * (1 - discount / 100);

      return acc + discountedAmount;
    }, 0).toFixed(2);
  };

  const calculateTaxAmount = () => {
    let taxAmount = 0;
    const isTamilNadu = customer.state === 'Tamil Nadu';

    items.forEach(item => {
      const rate = Number(item.rate) || 0;
      const quantity = Number(item.quantity) || 0;
      const gst = Number(item.gst) || 0;

      const baseAmount = rate * quantity;
      let totalTax = 0;
      const isTamilNadu = customer.state === 'Tamil Nadu';
      if (isTamilNadu) {
        const sgst = gst / 2;
        const cgst = gst / 2;
        const igst = '';
        totalTax = baseAmount * ((sgst + cgst) / 100);
      } else {
        const igst = gst;
        totalTax = baseAmount * (igst / 100);
      }

      taxAmount += totalTax;
    });

    return taxAmount.toFixed(2);
  };



  const calculateTotal = () => {
    const subtotal = Number(calculateSubtotal()) || 0;
    const taxAmount = Number(calculateTaxAmount()) || 0;
    const adjustedValue = adjustmentType === 'add' ? Number(adjustment) : -Number(adjustment);

    const totalBeforeAdjustment = subtotal + taxAmount;

    ('Subtotal:', subtotal);

    let total;

    if (taxType === 'TDS') {
      total = totalBeforeAdjustment * (1 - (Number(tax) / 100)) - adjustedValue;
    } else if (taxType === 'TCS') {
      total = totalBeforeAdjustment + (totalBeforeAdjustment * (Number(customTax) / 100)) + adjustedValue;
    } else {
      total = totalBeforeAdjustment;
    }



    return (Math.round(total * 100) / 100).toFixed(2);
  };


  const handleTaxChange = (e) => {
    const value = e.target.value;
    if (value === 'TCS') {
      setShowCustomTax(true);
      setTax('');
    } else {
      setShowCustomTax(false);
      setTax(Number(value));
    }
  };


  const handleCustomTaxChange = (e) => {
    const value = e.target.value;
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue) && value.trim() !== '') {
      setCustomTax(numericValue);
    } else {
      setCustomTax('');
    }
  };



  const handleTaxTypeChange = (e) => {
    setTaxType(e.target.value);
  };


  return (
    <div className='flex'>
      <div className="w-1/5">
        <SidePanel />
      </div>
      <div className="container mt-12 mx-auto p-4">
        <div className="max-w-9xl w-full bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6">Credit Notes</h1>
          <form className="space-y-8" onSubmit={(e) => {
            e.preventDefault();

          }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Customer Name*</label>
                <div>
                  <select
                    value={customer}
                    onChange={handleDropdownChange}
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

              <div>
                <label className="block text-sm font-medium text-gray-700">Credit Note #</label>
                <input
                  type="text"
                  value={creditNumber}
                  onChange={(e) => setcreditNumber(e.target.value)}
                  placeholder='Enter Credit Number'
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Reference Number</label>
                <input
                  type="text"
                  value={referenceNumber}
                  onChange={(e) => setreferenceNumber(e.target.value)}
                  placeholder='Enter reference number'
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Credit Note Date</label>
                <input
                  type="date"
                  value={creditDate}
                  onChange={(e) => setcreditDate(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>

            </div>



            {/* Items Table */}
            <table className="w-full table-auto mt-6">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>HsnCode</th>
                  <th>Quantity</th>
                  <th>Rate</th>
                  <th>Discount</th>
                  <th>GST (%)</th>
                  <th>SGST (%)</th>
                  <th>CGST (%)</th>
                  <th>IGST (%)</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <select
                        value={item.item}
                        onChange={(e) => handleItemChange(index, 'item', e.target.value)}
                        className="border border-gray-300 rounded-md p-2"
                      >
                        <option value="">Select an item</option>
                        {availableItems.map((availableItem, idx) => (
                          <option key={idx} value={availableItem.name}>
                            {availableItem.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="text" // Use "text" instead of "number" to remove up/down arrows
                        value={item.HsnCode}
                        onChange={(e) => {
                          // Allow only numbers and ensure value doesn't go below 0
                          const value = e.target.value;
                          if (/^\d*$/.test(value)) { // Regex to allow only digits (no letters or special characters)
                            handleItemChange(index, 'HsnCode', value === '' ? '' : Math.max(0, Number(value)));
                          }
                        }}
                        className="border border-gray-300 rounded-md p-2 w-full"
                      />
                    </td>
                    <td>n
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        className="border border-gray-300 rounded-md p-2 w-full"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={item.rate}
                        onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                        className="border border-gray-300 rounded-md p-2 w-full"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={item.discount}
                        onChange={(e) => handleItemChange(index, 'discount', e.target.value)}
                        className="border border-gray-300 rounded-md p-2 w-full"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={item.gst}
                        readOnly
                        className="border border-gray-300 rounded-md p-2 w-full"
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        value={items[index].sgst || 0}
                        className="border p-2 w-full"
                        readOnly
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={items[index].cgst || 0}
                        className="border p-2 w-full"
                        readOnly
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={items[index].igst || ''}
                        className="border p-2 w-full"
                        readOnly
                      />
                    </td>

                    <td>{item.amount}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              type="button"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-600"
              onClick={addNewItem}
            >
              Add New Item
            </button>
            <div>
              <label className="block text-sm font-medium h-6 text-gray-700">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder='Enter subject here'
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Customer Notes</label>
              <input
                type="text"
                placeholder='Enter notes here'
                value={customerNotes}
                onChange={(e) => setcustomerNotes(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Terms and Conditions</label>
              <input
                type="text"
                value={terms}
                placeholder='Enter the terms and conditions of your business to be displayed in your transactions'
                onChange={(e) => setTerms(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <label htmlFor="salesperson" className="block text-sm h-2 font-medium text-gray-700">
              Salesperson
            </label>
            <select
              id="salesperson"
              onChange={(e) => setSalesperson(e.target.value)} // Update the salesperson ID or name
              name="salesperson"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="">Select a Salesperson</option>
              {salespersons.map((person, index) => (
                <option key={index} value={person.name}> {/* Use person.name as the value */}
                  {person.name}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => navigate('/dashboard/salesperson')}
              className="mt-5 inline-flex items-center px-5 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600"
            >
              Add Salesperson
            </button>

            {/* Tax and Adjustment Section */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tax Type</label>
                <select
                  value={taxType}
                  onChange={handleTaxTypeChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="">Select Tax Type</option>
                  <option value="TDS">TDS</option>
                  <option value="TCS">TCS</option>
                </select>
              </div>
              {taxType === 'TCS' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">TCS Rate</label>
                  <input
                    type="number"
                    value={customTax}
                    onChange={handleCustomTaxChange}
                    placeholder="Enter TCS Rate"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
              )}
              {taxType === 'TDS' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tax Rate</label>
                  <select
                    value={tax}
                    onChange={handleTaxChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  >
                    <option value="">Select Tax Rate</option>
                    <option value="5">Commission or Brokerage [5%]</option>
                    <option value="3.75">Commission or Brokerage (Reduced) [3.75%]</option>
                    <option value="10">Dividend [10%]</option>
                    <option value="7.5">Dividend (Reduced) [7.5%]</option>
                    {/* Add more options as required */}
                  </select>
                </div>
              )}

            </div>

            {/* Total Section */}
            <div className="my-4 p-4 border border-gray-300 rounded-md">
              <div>
                <span className="text-lg font-bold">Subtotal: {calculateSubtotal()}</span>
              </div>
              <div>
                <span className="text-lg font-bold">Total amount: {calculateTotal()}</span>
              </div>


              {customer.state === 'Tamil Nadu' ? (
                <>
                  <div>
                    <span>SGST ({items[0].gst / 2}%): {items.reduce((total, item) => total + (parseFloat(item.sgst) || 0), 0).toFixed(2)}</span>
                  </div>
                  <div>
                    <span>CGST ({items[0].gst / 2}%): {items.reduce((total, item) => total + (parseFloat(item.cgst) || 0), 0).toFixed(2)}</span>
                  </div>
                </>
              ) : (
                <div>
                  <span className="text-lg font-bold">TAX ({items[0].gst}%)</span>
                </div>
              )}
              <div>
                <span className="text-lg font-bold">Total: {calculateTotal()}</span>
              </div>
            </div>
            <div>
            </div>
            <button
              type="submit"
              onClick={handleSubmit}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600"
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreditNotes;
