import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SidePanel from '../Sales/Sidepanel.jsx';
import SalesPerson from '../Salesperson/SalesPerson.jsx';
import { jwtDecode } from 'jwt-decode';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';



const Estimate = () => {

  const [salespersons, setSalespersons] = useState([]);

  const [quoteNumber, setQuoteNumber] = useState('');
  const [quoteDate, setQuoteDate] = useState('');
  const [reference, setReference] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [subject, setSubject] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projects, setProjects] = useState([]);
  const [items, setItems] = useState([{ item: '', quantity: '', rate: '', discount: '', gst: '', sgst: '', amount: '' }]);
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
  const [selectedSalesperson, setSelectedSalesperson] = useState(''); // Initialize with an empty string
  const [loggedUser, setLoggedUser] = useState(null);

  const navigate = useNavigate();

  // console.log(projects);
  useEffect(() => {
    if (loggedUser) {
      fetchCustomers(loggedUser);
      fetchSalespeople(loggedUser);
      fetchItems(loggedUser);
      fetchProjects(loggedUser);
    }
  }, [loggedUser]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    const decoded = jwtDecode(token)

    setLoggedUser(decoded.email);
  }, []);

  const fetchSalespeople = async (loggedUser) => {
    try {
      const response = await axios.get('https://enterprisebillingsystem.onrender.com/api/salespersons',
        {
          params: { loggedUser }
        }
      );
      setSalespersons(response.data);
    } catch (error) {
      console.error('Error fetching salesperson data:', error);
    }
  };
  const fetchProjects = async (loggedUser) => {
    try {
      const response = await axios.get('https://enterprisebillingsystem.onrender.com/api/projects',
        {
          params: { loggedUser }
        }
      );
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching project data:', error);
    }
  };


  const fetchCustomers = async (loggedUser) => {
    try {
      const response = await axios.get('https://enterprisebillingsystem.onrender.com/api/customers',
        {
          params: { loggedUser }
        }
      );
      const customersWithState = response.data.map((cust) => ({
        ...cust,
        state: cust.billaddress.state,
      }));
      setCustomers(customersWithState);
    } catch (error) {
      console.error('Error fetching customer data:', error);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const total = calculateTotal(); // Ensure `total` is numeric
    const taxtype = "GST"; // Example, you can retrieve this from form inputs
    const taxrate = "18%"; // Example, retrieve this from form inputs

    try {
      const response = await axios.post('https://enterprisebillingsystem.onrender.com/api/estimates', {
        customer,
        quoteNumber,
        reference,
        quoteDate,
        expiryDate,
        salesperson: selectedSalesperson, // Assuming you're passing salesperson correctly
        projectName,
        subject,
        items, // Ensure `items` is a valid array/object
        taxtype,
        taxrate,
        total,
        loggedUser
      });

      toast.success(response.data.message);
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.error || 'An error occurred while adding the estimate');
    }
  };





  const handleDropdownChanges = (e, setter, redirectPath) => {
    const { value } = e.target;
    if (value === `new ${redirectPath}`) {
      navigate(`/dashboard/${redirectPath}/form`);
    } else {
      setter(value);
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
      const response = await axios.get('https://enterprisebillingsystem.onrender.com/api/items',
        {
          params: { loggedUser }
        }
      );
      setAvailableItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
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



  const setGSTForState = (index, gst) => {
    const newItems = [...items];

    if (customer.state === 'Tamil Nadu') {
      const halfGST = gst / 2;
      newItems[index].sgst = halfGST.toFixed(2);
      newItems[index].cgst = halfGST.toFixed(2);
      newItems[index].igst = '';
    } else {
      newItems[index].sgst = '';
      newItems[index].cgst = '';
      newItems[index].igst = gst.toFixed(2);
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
    const teens = ['Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['Ten', ...teens];

    const higherUnits = ['', 'Thousand', 'Lakh', 'Crore'];

    if (num === 0) return 'Zero Rupees Only';

    let words = '';


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
        <div className="max-w-8xl w-full bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6">New Quote</h1>
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
                <label className="block text-sm font-medium mb-1">Customer State*</label>
                <input
                  type="text"
                  value={customerState}
                  readOnly
                  placeholder='Enter Customer state'
                  required
                  className="border border-gray-300 rounded-md p-2 w-full focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="form-group">
                <label>Quote#</label>
                <input type="text" value={quoteNumber} required placeholder='Enter Quote number' onChange={(e) => setQuoteNumber(e.target.value)} />
              </div>

              <div className="form-group">
                <label>Reference#</label>
                <input type="text" value={reference} required placeholder='Enter Reference id' onChange={(e) => setReference(e.target.value)} />
              </div>

              <div className="form-group">
                <label>Quote Date*</label>
                <input type="date" value={quoteDate} onChange={(e) => setQuoteDate(e.target.value)} />
              </div>

              <div className="form-group">
                <label>Expiry Date</label>
                <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Project Name</label>
                <select value={projectName} onChange={(e) => handleDropdownChanges(e, setProjectName, 'projects')}>
                  <option value="">Select a project</option>
                  {projects.map((proj) => (
                    <option key={proj.id} value={proj.name}>{proj.name}</option>
                  ))}
                  <option value="new projects">Add New Project</option>
                </select>
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
                        className="border border-gray-300 rounded-md p-2 w-full"
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
                placeholder='Add more details here'
                className="mt-1 block w-full border h-16 border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <label htmlFor="salesperson" className="block text-sm font-medium text-gray-700">
              Salesperson
            </label>
            {/* // Assuming you are using a <select> for salespersons */}
            <select className='border-gray-700 ' onChange={(e) => setSelectedSalesperson(e.target.value)} value={selectedSalesperson}>
              {salespersons.map((sp) => (
                <option key={sp.id} value={sp.name} >
                  {sp.name}
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
              <div className="mb-2">
                <span className="text-lg font-bold">Subtotal: </span>
                <span className="text-lg">{calculateSubtotal()}</span>
              </div>
              <div className="mb-2">
                <span className="text-lg font-bold">Tax Amount: </span>
                <span className="text-lg">{calculateTaxAmount()}</span>
              </div>
              <div className="mb-2">
                <span className="text-lg font-bold">Total Amount: </span>
                <span className="text-lg">{calculateTotal()}</span>
              </div>


              {customer.state === 'Tamil Nadu' ? (
                <>
                  <div className="mb-2">
                    <span className="text-lg font-bold">SGST ({items[0].gst / 2}%): </span>
                    <span className="text-lg">{items.reduce((total, item) => total + (parseFloat(item.sgst) || 0), 0).toFixed(2)}</span>
                  </div>
                  <div className="mb-2">
                    <span className="text-lg font-bold">CGST ({items[0].gst / 2}%): </span>
                    <span className="text-lg">{items.reduce((total, item) => total + (parseFloat(item.cgst) || 0), 0).toFixed(2)}</span>
                  </div>
                </>
              ) : (
                <div className="mb-2">
                  <span className="text-lg font-bold">TAX ({items[0].gst}%): </span>
                  <span className="text-lg">{calculateTaxAmount()}</span>
                </div>
              )}
              <div className="mt-4">
                <span className="text-xl font-extrabold">Total: </span>
                <span className="text-xl">{calculateTotal()}</span>
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

export default Estimate;
