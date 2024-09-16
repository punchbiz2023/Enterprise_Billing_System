import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const InvoiceForm = () => {
  // State for invoice form fields
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

  useEffect(() => {
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
  const handleCheckboxChange = (e) => {
    setPaymentReceived(e.target.checked);
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
    if (field === 'rate' || field === 'quantity' || field === 'gst' || field === 'sgst') {
      // Update amount based on new rate, quantity, GST, and SGST
      const rate = newItems[index].rate;
      const quantity = newItems[index].quantity;
      const gst = newItems[index].gst;
      const sgst = newItems[index].sgst;
      newItems[index].amount = (quantity * rate * (1 + gst / 100) * (1 + sgst / 100)).toFixed(2);
    }
    setItems(newItems);
  };

  const addNewItem = () => {
    setItems([...items, { item: '', quantity: '', rate: '', discount: '', gst: '', sgst: '', amount: '' }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + Number(item.amount), 0);
  };

  const calculateTaxAmount = () => {
    let taxAmount = 0;
  
    // Iterate over each item to calculate tax based on item rate
    items.forEach(item => {
      const rate = Number(item.rate);
      const quantity = Number(item.quantity);
      const gst = Number(item.gst);
      const sgst = Number(item.sgst);
      const amount = (quantity * rate * (1 + gst / 100) * (1 + sgst / 100)).toFixed(2);
  
      if (taxType === 'TDS') {
        taxAmount += (quantity * rate * (tax / 100)); // Calculate tax based on rate
      } else if (taxType === 'TCS') {
        taxAmount += (quantity * rate * (Number(customTax) / 100)); // Calculate tax based on customTax
      }
    });
  
    return taxAmount.toFixed(2); // Return the total tax amount
  };
  
  

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const taxAmount = calculateTaxAmount();
    const adjustedValue = adjustmentType === 'add' ? Number(adjustment) : -Number(adjustment);
  
    if (taxType === 'TDS') {
      return (subtotal - Number(taxAmount) + adjustedValue).toFixed(2);
    } else if (taxType === 'TCS') {
      return (subtotal + Number(taxAmount) + adjustedValue).toFixed(2);
    } else {
      return (subtotal + adjustedValue).toFixed(2);
    }
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
  
  
  const generatePDF = () => {
    const doc = new jsPDF();
  
    // Load the company logo (Assuming you have a base64 image or can get it via URL)
    const logo = 'data:image/jpeg;base64,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';  // Add your base64 encoded image here or load from URL
  
    // Set margin and default font size
  const margin = 20;
  doc.setFontSize(12);

  // Add company logo on the right side
  doc.addImage(logo, 'JPEG', 160, margin, 30, 30); // Logo on the right side (adjust position and size as needed)

  // Header Section
  doc.setFontSize(22);
  doc.text('TAX INVOICE', margin, margin + 10);
  doc.setFontSize(12);
  doc.text('PUNCHBIZ', margin + 5, margin + 20);

  // Invoice details box with subtle border and background color
  doc.setFont('helvetica', 'normal'); // Use 'helvetica' and normal font for regular text
  doc.setFillColor(240, 240, 240); // Light gray background
  doc.rect(margin, margin + 30, 170, 50, 'F'); // Filled box for invoice details
  doc.text(`Invoice #: ${invoiceNumber}`, margin + 5, margin + 40);
  doc.text(`Invoice Date: ${invoiceDate}`, margin + 5, margin + 50);
  doc.text(`Due Date: ${dueDate}`, margin + 90, margin + 50);
  doc.text(`Terms: ${terms}`, margin + 5, margin + 60);
  doc.text(`P.O. #: 12345`, margin + 90, margin + 60);

  // Customer details box
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, margin + 90, 170, 30, 'F');
  doc.text(`Bill To: ${customerName}`, margin + 5, margin + 100);
  doc.text(`Address: ${customerAddress}`, margin + 5, margin + 110);
  doc.text(`Phone: ${customerPh}`, margin + 90, margin + 110);
  doc.text(`Email: ${customerMail}`, margin + 90, margin + 100);

  // Subject
  doc.text(`Subject: ${subject}`, margin + 5, margin + 130);

  // Items Table
  doc.autoTable({
    startY: margin + 140,
    head: [['Item & Description', 'Qty', 'Rate', 'Amount']],
    body: items.map(item => [item.item, item.quantity, item.rate, item.amount]),
    theme: 'grid', // Adds boxed style to the table
    headStyles: { fillColor: [220, 220, 220] }, // Light gray header
    margin: { left: margin },
  });

  // Subtotal, TCS, Total box
  let finalY = doc.autoTable.previous.finalY + 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold'); // Use 'bold' for totals
  doc.rect(margin, finalY, 170, 40, 'F'); // Box for totals
  doc.text(`Sub Total: ₹${calculateSubtotal().toFixed(2)}`, margin + 5, finalY + 10);
  doc.text(`TCS (206C(1H)): ₹${calculateTaxAmount()}`, margin + 5, finalY + 20);
  doc.text(`Total: ₹${calculateTotal()}`, margin + 5, finalY + 30);

  // Total in words
  const totalInWords = numberToWords(Number(calculateTotal()));
  doc.text(`Total In Words: ${totalInWords}`, margin + 9, finalY + 45);

  // Signature and Balance Due section
  doc.setFont('helvetica', 'normal'); // Back to normal font for other text
  doc.text(`Authorized Signature`, margin, finalY + 60);
  doc.text(`Balance Due: ₹${calculateTotal()-calculateTotal()}`, margin + 100, finalY + 60);

  // Save PDF
  doc.save(`Invoice_${invoiceNumber}.pdf`);
};
  
  
 // Will log the value of isModalOpen to ensure it changes

  return (
    <div className="p-6 mt-8 bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">New Invoice</h1>
        <form className="space-y-8" onSubmit={(e) => {
          e.preventDefault();
          generatePDF();
        }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Customer Name*</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
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
                      step="0.01"
                      value={item.gst}
                      onChange={(e) => handleItemChange(index, 'gst', e.target.value)}
                      className="border border-gray-300 rounded-md p-2 w-full"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.sgst}
                      onChange={(e) => handleItemChange(index, 'sgst', e.target.value)}
                      className="border border-gray-300 rounded-md p-2 w-full"
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
          <div className="text-right mt-6">
            <p className="text-lg font-semibold">Subtotal: ₹{calculateSubtotal().toFixed(2)}</p>
            <p className="text-lg font-semibold">Tax Amount: ₹{calculateTaxAmount()}</p>
            <p className="text-lg font-semibold">Total: ₹{calculateTotal()}</p>
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
  );
};

export default InvoiceForm;
