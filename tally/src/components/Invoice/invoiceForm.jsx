import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { pdf } from '@react-pdf/renderer';
import SidePanel from '../Sales/Sidepanel.jsx';
import { Link, useNavigate } from 'react-router-dom';
import InvoicePDF from './InvoicePDF.jsx';


const InvoiceForm = () => {
  const [salesperson, setSalesperson] = useState('');
  const [salespersons, setSalespersons] = useState([]);
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
  const [formData, setFormData] = useState({}); // Initialize formData state
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
    // Update formData whenever any of the fields change
    const updatedFormData = {
      items: items,
      invoiceNumber: invoiceNumber,
      invoiceDate: invoiceDate,
      dueDate: dueDate,
      customerName: customerName,
      customerAddress: customerAddress,
      customerPh: customerPh,
      customerMail: customerMail,
      subject: subject,
      terms: terms,
      subTotal: Number(calculateSubtotal()).toFixed(2),
      tax: tax,
      TCS: calculateTaxAmount(),
      total: calculateTotal(),
      totalInWords: numberToWords(Number(calculateTotal()))
    };
    setFormData(updatedFormData); // Update formData state
  }, [items, invoiceNumber, invoiceDate, dueDate, customerName, customerAddress, customerPh, customerMail, subject, terms, tax]);


  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    const decoded = jwtDecode(token)
    setLoggedUser(decoded.email);
  }, []);

  const fetchSalespeople = async (loggedUser) => {
    try {
      const response = await axios.get('https://enterprisebillingsystem.onrender.com/api/salespersons', {
        params: { loggedUser }
      });
      setSalespersons(response.data);
    } catch (error) {
      console.error('Error fetching salesperson data:', error);
    }
  };

  const fetchCustomers = async (loggedUser) => {
    try {
      const response = await axios.get('https://enterprisebillingsystem.onrender.com/api/customers', {
        params: { loggedUser }
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

    if (e.target.value == 'new customer') {
      navigate('/dashboard/sales/customers/form')
    } else {

      const selectedCustomer = customers.find((cust) => cust.name === selectedCustomerName);
      if (selectedCustomer) {
        setCustomerName(selectedCustomer.name)
        setCustomerState(selectedCustomer.state);
        // setCustomerAddress(selectedCustomer.billaddress);

        setCustomerPh(selectedCustomer.workphone);
        setCustomerMail(selectedCustomer.mail)
      } else {
        setCustomerState('');
        setCustomerAddress('');
        setCustomerPh('');
        setCustomerMail('');
      }
    }


  };

  const handleSalesperson = (e) => {
    setSalesperson(e.target.value)
    // console.log(e.target.value);

  }

  const handleSubmit = async () => {
    const invoiceData = {
      name: customer,
      state: customerState,
      phone: customerPh,
      mail: customerMail,
      invoiceid: invoiceNumber,
      invdate: invoiceDate,
      duedate: dueDate,
      terms: terms,
      subject: subject,
      salesperson: salesperson,
      taxtype: taxType,
      taxrate: tax,
      amount: calculateTotal()
    };

    // console.log('Invoice data being sent:', invoiceData);
    const invData = { ...invoiceData, loggedUser }

    try {
      const response = await axios.post('https://enterprisebillingsystem.onrender.com/api/invoice', invData);
      // console.log('Invoice submitted successfully', response.data);
      navigate('/dashboard/sales/invoice')
    } catch (error) {
      console.error('Error submitting invoice', error);
    }
  };


  const fetchItems = async (loggedUser) => {
    try {
      const response = await axios.get('https://enterprisebillingsystem.onrender.com/api/items', {
        params: { loggedUser }
      });
      setAvailableItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleDownload = async () => {
    const blob = await pdf(<InvoicePDF formData={formData} />).toBlob(); // Pass formData to InvoicePDF component
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'invoice.pdf';
    link.click();
  };

  const handleCheckboxChange = (e) => {
    setIsPaymentReceived(e.target.checked);
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

  const numberToWords = (num) => {
    const singleDigits = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const doubleDigits = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

    const higherUnits = ['', 'Thousand', 'Lakh', 'Crore'];

    if (num === 0) return 'Zero Rupees Only';

    let words = '';

    const convertBelowThousand = (n) => {
      let str = '';
      if (n > 99) {
        str += singleDigits[Math.floor(n / 100)] + ' Hundred ';
        n %= 100;
      }
      if (n >= 10 && n < 20) {
        str += teens[n - 10] + ' ';
      } else {
        if (n >= 20) {
          str += doubleDigits[Math.floor(n / 10)] + ' ';
          n %= 10;
        }
        if (n > 0) {
          str += singleDigits[n] + ' ';
        }
      }
      return str.trim();
    };

    const getChunks = (num) => {
      let chunks = [];

      // Extract last three digits (hundreds, tens, and ones)
      chunks.push(num % 1000);
      num = Math.floor(num / 1000);

      // Extract thousands (next two digits)
      while (num > 0) {
        chunks.push(num % 100); // Lakh and Crore are in pairs of two digits
        num = Math.floor(num / 100);
      }

      return chunks.reverse();
    };

    const chunks = getChunks(num);
    let unitIndex = chunks.length - 1;

    // Process the chunks in the order needed for the Indian numbering system
    for (let i = 0; i < chunks.length; i++) {
      if (chunks[i] !== 0) {
        words += convertBelowThousand(chunks[i]) + (higherUnits[unitIndex] ? ' ' + higherUnits[unitIndex] : '') + ' ';
      }
      unitIndex--;
    }

    return words.trim() + ' Rupees Only';
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
      <div className="p-6 mt-8 mr-20 ml-20 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="max-w-9xl w-full bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6">New Invoice</h1>
          <form className="space-y-8" onSubmit={(e) => {
            e.preventDefault();
            handleDownload();
          }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Customer Name</label>
                <div>
                  <select
                    value={customer}
                    onChange={handleDropdownChange}
                    className="border border-gray-300 rounded-md p-2 w-full focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="" hidden>Select a customer</option>
                    <option value="new customer" className='text-blue-500'>Add New Customer</option>
                    {customers.map((cust) => (
                      <option key={cust.id} value={cust.name}>{cust.name}</option>
                    ))}

                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Customer State*</label>
                <input
                  type="text"
                  value={customerState}
                  placeholder='Enter Customer State'
                  readOnly
                  required
                  className="border border-gray-300 rounded-md p-2 w-full focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Customer Contact</label>
                <input
                  type="text"
                  value={customerPh}
                  // onChange={(e) => setCustomerPh(e.target.value)}
                  readOnly
                  required
                  placeholder='Enter Customer Phone number'
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Customer Mail</label>
                <input
                  type="text"
                  value={customerMail}
                  // onChange={(e) => setCustomerMail(e.target.value)}
                  readOnly
                  required
                  placeholder='Enter customer Email'
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Customer Addrress*</label>
                <input
                  type="text"
                  value={customerAddress}
                  required
                  placeholder='Enter Customer Address'
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  // readOnly
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Invoice #</label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  placeholder='Enter Invoice number'
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
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
                        type="text"
                        value={item.gst}
                        readOnly
                        className="border border-gray-300 rounded-md p-2"
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        value={items[index].sgst || ''}
                        className="border p-2 w-full"
                        readOnly
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={items[index].cgst || ''}
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
              <label className="block text-sm font-medium text-gray-700">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder='Enter other details'
                className="mt-1 block w-full border h-16 border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <label htmlFor="salesperson" className="block text-sm font-medium text-gray-700">
              Salesperson
            </label>
            <select id="salesperson" onChange={handleSalesperson} name="salesperson" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
              <option value="">Select a Salesperson</option>
              {salespersons.map((person, index) => (
                <option key={index} value={person.name}>
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

                  </select>
                </div>
              )}

            </div>
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
              onClick={handleSubmit}
            >
              Generate PDF
            </button>
          </form>


        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
