import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SidePanel from '../sales/SidePanel';


const Order = () => {

  const [salespersons, setSalespersons] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSalesperson, setNewSalesperson] = useState({ name: '', mail: '' });
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerPh, setCustomerPh] = useState('');
  const [customerMail, setCustomerMail] = useState('');
  const [subject, setSubject] = useState('');
  const [terms, setTerms] = useState('Due On Receipt');
  const [items, setItems] = useState([{ item: '', quantity: '', rate: '', discount: '', gst: '', sgst: '', amount: '' }]);
  const [availableItems, setAvailableItems] = useState([]);
  const [taxType, setTaxType] = useState('');
  const [tax, setTax] = useState(0);
  const [customTax, setCustomTax] = useState('');
  const [adjustment, setAdjustment] = useState(0);
  const [adjustmentType, setAdjustmentType] = useState('add');
  const [showCustomTax, setShowCustomTax] = useState(false);
  const [paymentReceived, setPaymentReceived] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [customer, setCustomer] = useState('');
  const [customerState, setCustomerState] = useState('');
  const [isPaymentReceived, setIsPaymentReceived] = useState(false);
  const [salesOrder, setsalesOrder] = useState('');
  const [salesDate, setsalesDate] = useState('');
  const [salesshipDate, setsalesshipDate] = useState('');

  useEffect(() => {
    fetchCustomers();
    fetchSalespeople();
    fetchItems();
  }, []);

  const fetchSalespeople = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/salespeople');
      setSalespersons(response.data);
    } catch (error) {
      console.error('Error fetching salesperson data:', error);
    }
  };


  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/customers');
      const customersWithState = response.data.map((cust) => ({
        ...cust,
        state: cust.billaddress.state, // Ensure the state is available from billaddress
      }));
      setCustomers(customersWithState);
    } catch (error) {
      console.error('Error fetching customer data:', error);
    }
  };
  const handleDropdownChange = (e) => {
    const selectedCustomerName = e.target.value;
    setCustomer(selectedCustomerName);

    // Find the selected customer and update the state with the customer's state
    const selectedCustomer = customers.find((cust) => cust.name === selectedCustomerName);
    if (selectedCustomer) {
      setCustomerState(selectedCustomer.state); // Set customer state from the selected customer
    } else {
      setCustomerState(''); // Clear state if no customer is selected
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSalesperson({ ...newSalesperson, [name]: value });
  };
  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/items');
      setAvailableItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };
  const handleDownload = async () => {
    const blob = await pdf(<MyDocument />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'invoice.pdf';
    link.click();
  };
  const handleCheckboxChange = (e) => {
    setIsPaymentReceived(e.target.checked);
  };

  const handleAddSalesperson = () => {
    // Close the modal and add the salesperson to the list
    setSalespersons([...salespersons, newSalesperson.name]);
    setNewSalesperson({ name: '', mail: '' });
    setIsModalOpen(false);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    if (field === 'gst') {
      const gst = parseFloat(value) || 0;
      setGSTForState(index, gst);
    }

    if (['rate', 'quantity', 'discount', 'gst', 'sgst', 'cgst', 'igst'].includes(field)) {
      const rate = parseFloat(newItems[index].rate) || 0;
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



  const setGSTForState = (index, gst) => {
    const newItems = [...items];

    if (customer.state === 'Tamil Nadu') {
      const halfGST = gst / 2;
      newItems[index].sgst = halfGST.toFixed(2);
      newItems[index].cgst = halfGST.toFixed(2);
      newItems[index].igst = '';  // Clear IGST for Tamil Nadu
    } else {
      newItems[index].sgst = '';  // Clear SGST
      newItems[index].cgst = '';  // Clear CGST
      newItems[index].igst = gst.toFixed(2);  // Set full GST as IGST
    }

    setItems(newItems);
  };





  const addNewItem = () => {
    setItems([...items, { item: '', quantity: '', rate: '', discount: '', gst: '', sgst: '', cgst: '', igst: '', amount: '' }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateSubtotal = () => {
    // Calculate subtotal from items
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
    console.log('Subtotal:', subtotal);
    console.log('Tax Amount:', taxAmount);
    console.log('Total Before Adjustment:', totalBeforeAdjustment);
    console.log('Adjustment Value:', adjustedValue);

    let total;

    if (taxType === 'TDS') {
      total = totalBeforeAdjustment * (1 - (Number(tax) / 100)) - adjustedValue;
    } else if (taxType === 'TCS') {
      total = totalBeforeAdjustment + (totalBeforeAdjustment * (Number(customTax) / 100)) + adjustedValue;
    } else {
      total = totalBeforeAdjustment;
    }

    console.log('Total After Tax Type Adjustment:', total);

    return (Math.round(total * 100) / 100).toFixed(2);
  };


  const numberToWords = (num) => {
    const singleDigits = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const doubleDigits = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['Ten', ...teens];

    const higherUnits = ['', 'Thousand', 'Lakh', 'Crore'];  // Higher Indian units

    if (num === 0) return 'Zero Rupees Only';

    let words = '';

    // Function to convert numbers less than 1000
    const convertBelowThousand = (n) => {
      let str = '';
      if (n > 99) {
        str += singleDigits[Math.floor(n / 100)] + ' Hundred ';
        n %= 100;
      }
      if (n > 10 && n < 20) {
        str += teens[n - 11] + ' ';
      } else {
        if (n >= 10) {
          str += doubleDigits[Math.floor(n / 10)] + ' ';
          n %= 10;
        }
        if (n > 0) {
          str += singleDigits[n] + ' ';
        }
      }
      return str.trim();
    };

    // Split number into chunks of thousands, lakhs, crores
    let unitIndex = 0;
    while (num > 0) {
      let chunk = num % 1000;
      if (chunk !== 0) {
        words = convertBelowThousand(chunk) + (higherUnits[unitIndex] ? ' ' + higherUnits[unitIndex] : '') + ' ' + words;
      }
      num = Math.floor(num / 1000);
      unitIndex++;
    }

    return words.trim() + ' Rupees Only';
  };


  const handleTaxChange = (e) => {
    const value = e.target.value;
    if (value === 'TCS') {
      setShowCustomTax(true);
      setTax(''); // Clear tax when TCS is selected
    } else {
      setShowCustomTax(false);
      setTax(Number(value)); // Set tax for TDS
    }
  };


  const handleCustomTaxChange = (e) => {
    const value = e.target.value;
    const numericValue = parseFloat(value); // Convert to number
    if (!isNaN(numericValue) && value.trim() !== '') {
      setCustomTax(numericValue);
    } else {
      setCustomTax(''); // Clear or handle invalid input
    }
  };



  const handleTaxTypeChange = (e) => {
    setTaxType(e.target.value);
  };



  // Generate PDF dynamically based on form inputs


  // Define styles
  // Define styles
  

  // Define the document
  

  // Will log the value of isModalOpen to ensure it changes

  return (
    <div className='flex'>
      <div className="w-1/5">
        <SidePanel />
      </div>
      <div className="p-6 mt-8 mr-20 ml-20 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="max-w-7xl w-full bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6">Sales Order</h1>
          <form className="space-y-8" onSubmit={(e) => {
            e.preventDefault();
            
          }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Customer Name*</label>
                <div className="relative">
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
                <label className="block text-sm font-medium mb-1">Customer State*</label>
                <input
                  type="text"
                  value={customerState}
                  readOnly
                  className="border border-gray-300 rounded-md p-2 w-full focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Customer Addrress*</label>
                <input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Customer Contact</label>
                <input
                  type="text"
                  value={customerPh}
                  onChange={(e) => setCustomerPh(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Customer Mail</label>
                <input
                  type="text"
                  value={customerMail}
                  onChange={(e) => setCustomerMail(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Invoice #*</label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Sales Order Number</label>
                <input
                  type="text"
                  value={salesOrder}
                  onChange={(e) => setsalesOrder(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Sales Order Date</label>
                <input
                  type="date"
                  value={salesDate}
                  onChange={(e) => setsalesDate(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Expected Shipment Date</label>
                <input
                  type="date"
                  value={salesshipDate}
                  onChange={(e) => setsalesshipdate(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Invoice Date*</label>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Due Date*</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Terms</label>
                <select
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option>Due On Receipt</option>
                  <option>Net 30</option>
                  <option>Net 60</option>
                </select>
              </div>
            </div>

            {/* Items Table */}
            <table className="w-full table-auto mt-6">
              <thead>
                <tr>
                  <th>Item</th>
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
                        type="number"
                        value={items[index].gst || ''}
                        onChange={(e) => handleItemChange(index, 'gst', e.target.value)}
                        className="border p-2 w-full"
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        value={items[index].sgst || ''}
                        className="border p-2 w-full"
                        readOnly // Automatically filled based on state
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={items[index].cgst || ''}
                        className="border p-2 w-full"
                        readOnly // Automatically filled based on state
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={items[index].igst || ''}
                        className="border p-2 w-full"
                        readOnly // Automatically filled based on state
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
              <label className="block text-sm font-medium text-gray-700">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <label htmlFor="salesperson" className="block text-sm font-medium text-gray-700">
              Salesperson
            </label>
            <select id="salesperson" name="salesperson" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
              <option value="">Select a Salesperson</option>
              {salespersons.map((person, index) => (
                <option key={index} value={person}>
                  {person}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
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
              {/* <div>
              <label className="block text-sm font-medium text-gray-700">Adjustment</label>
              <input
                type="number"
                value={adjustment}
                onChange={(e) => setAdjustment(e.target.value)}
                placeholder="Adjustment Amount"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              <select
                value={adjustmentType}
                onChange={(e) => setAdjustmentType(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="add">Add</option>
                <option value="subtract">Subtract</option>
              </select>
            </div> */}
            </div>

            {/* Total Section */}
            <div>
              <div>
                <span>Subtotal: {calculateSubtotal()}</span>
              </div>
              <div>
                <span>Tax Amount: {calculateTaxAmount()}</span>
              </div>
              <div>
                <span>Total amount: {calculateTotal()}</span>
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
                  <span>TAX ({items[0].gst}%)</span>
                </div>
              )}
              <div>
                <span>Total: {calculateTotal()}</span>
              </div>
            </div>



            <div>

              <div className="payment-checkbox">
                <input
                  type="checkbox"
                  id="paymentReceived"
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="paymentReceived">I have received the payment</label>
              </div>
              {isPaymentReceived && (
                <div className="payment-form">
                  <table>
                    <thead>
                      <tr>
                        <th>Payment Mode</th>
                        <th>Deposit To</th>
                        <th>Amount Received</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <select name="paymentMode">
                            <option value="cash">Cash</option>
                            <option value="cheque">Cheque</option>
                            <option value="bank_transfer">Bank Transfer</option>
                            <option value="credit_card">Credit Card</option>
                            <option value="upi">UPI</option>
                          </select>
                        </td>
                        <td>
                          <select name="depositTo">
                            <option value="pettyCash">Petty Cash</option>
                            <option value="undeposited_funds">Undeposited Funds</option>
                            <option value="employee_reimbursements">Employee Reimbursements</option>
                            <option value="opening_balance_adjustments">Opening Balance Adjustments</option>
                            <option value="tcs_payable">TCS Payable</option>
                            <option value="tds_payable">TDS Payable</option>
                          </select>
                        </td>
                        <td>
                          <input
                            name="amountReceived"
                            value={calculateTotal()}
                            readOnly
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="total-amount">
                    <p>Total (₹): <span>{calculateTotal()}</span></p>
                    <p>Balance Amount (₹): <span>0.00</span></p>
                  </div>
                </div>
              )}


            </div>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600"
            >
              Generate PDF
            </button>
          </form>

          {/* Conditional rendering of the modal */}
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                <h2 className="text-xl font-bold mb-4">Add Salesperson</h2>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={newSalesperson.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
                <label className="block text-sm font-medium text-gray-700 mt-4">Mail ID</label>
                <input
                  type="email"
                  name="mail"
                  value={newSalesperson.mail}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-500 hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddSalesperson}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600"
                  >
                    Add Salesperson
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;
