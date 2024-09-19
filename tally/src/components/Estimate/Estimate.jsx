import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './estimate.css';
import SidePanel from '../sales/SidePanel';

const Estimate = () => {
  const [customer, setCustomer] = useState('');
  const [customers, setCustomers] = useState([]);
  const [quoteNumber, setQuoteNumber] = useState('');
  const [quoteDate, setQuoteDate] = useState('');
  const [reference, setReference] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [salesperson, setSalesperson] = useState('');
  const [salespeople, setSalespeople] = useState([]);
  const [projectName, setProjectName] = useState('');
  const [projects, setProjects] = useState([]);
  const [subject, setSubject] = useState('');
  const [items, setItems] = useState([{ item: '', quantity: 1, rate: '', discount: '', gst: '', cgst: '', sgst: '', igst: '', amount: '' }]);
  const [availableItems, setAvailableItems] = useState([]);
  const [taxType, setTaxType] = useState('');
  const [tax, setTax] = useState(0);
  const [customTax, setCustomTax] = useState('');
  const [adjustment, setAdjustment] = useState(0);
  const [adjustmentType, setAdjustmentType] = useState('add');
  const [showCustomTax, setShowCustomTax] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/customers');
        setCustomers(response.data);
      } catch (error) {
        console.error('Error fetching customer data:', error);
      }
    };

    const fetchSalespeople = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/salespersons');
        setSalespeople(response.data);
      } catch (error) {
        console.error('Error fetching salesperson data:', error);
      }
    };

    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/projects');
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    };

    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/items');
        setAvailableItems(response.data);
      } catch (error) {
        console.error('Error fetching item data:', error);
      }
    };

    fetchCustomers();
    fetchSalespeople();
    fetchProjects();
    fetchItems();

    const currentDate = new Date().toISOString().slice(0, 10);
    setQuoteDate(currentDate);

  }, []);

  /*const addNewItem = () => {
    setItems([...items, { item: '', quantity: 1, rate: 0, discount: 0, amount: 0 }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];

    if (field === 'item') {
      const selectedItem = availableItems.find((it) => it.name === value);
      updatedItems[index] = {
        ...updatedItems[index],
        item: value,
        rate: selectedItem ? selectedItem.salesprice : 0,
      };
    } else {
      updatedItems[index][field] = value;
    }
    if (value === 'new item') {
      navigate('/dashboard/items/form');
    }

    setItems(updatedItems);
  }; */

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

      if (field === 'item') {
        const selectedItem = availableItems.find((it) => it.name === value);
        updatedItems[index] = {
          ...updatedItems[index],
          item: value,
          rate: selectedItem ? selectedItem.salesprice : 0,
        };
      } else {
        updatedItems[index][field] = value;
      }

      if (value === 'new item') {
        navigate('/dashboard/items/form');
      }
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
    return items.reduce((sum, item) => sum + (item.quantity * item.rate * (1 - item.discount / 100)), 0);
  };
  
  const calculateTaxAmount = () => {
    const subtotal = calculateSubtotal();
    const taxValue = showCustomTax ? customTax : tax;
    return (subtotal * (taxValue / 100)).toFixed(2);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    let taxAmount = 0;
  
    // Debugging output
    console.log('Subtotal:', subtotal);
    console.log('Tax Type:', taxType);
    console.log('Custom Tax Rate:', customTax);
  
    // Calculate tax amount based on tax type
    if (taxType === 'tds') {
      taxAmount = (subtotal * (customTax / 100)).toFixed(2); // TCS is added
    } else if (taxType === 'tcs') {
      taxAmount = (subtotal * (customTax / 100)).toFixed(2); // TDS is subtracted
    } else {
      taxAmount = calculateTaxAmount(); // Other tax types
    }
  
    // Debugging output
    console.log('Tax Amount:', taxAmount);
  
    const adjustedValue = adjustmentType === 'add' ? Number(adjustment) : -Number(adjustment);
  
    // Debugging output
    console.log('Adjustment Value:', adjustedValue);
  
    // Ensure correct total calculation
    const total = subtotal + (taxType === 'tcs' ? Number(taxAmount) : 0) - (taxType === 'tds' ? Number(taxAmount) : 0) + adjustedValue;
  
    // Debugging output
    console.log('Total:', total);
  
    return total.toFixed(2);
  };

  const handleDropdownChange = (e, setter, redirectPath) => {
    const { value } = e.target;
    if (value === `new ${redirectPath}`) {
      navigate(`/dashboard/${redirectPath}/form`);
    } else {
      setter(value);
    }
  };

  const handleTaxChange = (e) => {
    const value = e.target.value;
  
    if (value === 'Others') {
      setShowCustomTax(true);
      setTax(0);
    } else if (value === 'tds') {
      setShowCustomTax(true); // Enable custom tax input
      setCustomTax(0); // Reset custom tax value for TDS
      setTaxType('tds'); // Set tax type to TDS
    } else if (value === 'tcs') {
      setShowCustomTax(true); // Enable custom tax input
      setCustomTax(0); // Reset custom tax value for TCS
      setTaxType('tcs'); // Set tax type to TCS
    } else {
      setShowCustomTax(false);
      setTax(Number(value));
      setTaxType(value);
    }
  };

  const handleCustomTaxChange = (e) => {
    setCustomTax(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const estimateData = {
      cname: customer,
      quotenum: quoteNumber,
      refnum: reference,
      qdate: quoteDate,
      expdate: expiryDate,
      salesperson,
      project: projectName,
      subject,
      itemtable: items,
      subtotal: {
        subtotal: calculateSubtotal(),
        tax: taxType === 'tcs' ? (calculateSubtotal() * (customTax / 100)).toFixed(2) : calculateTaxAmount(),
        adjustment: adjustmentType === 'add' ? adjustment : -adjustment,
        total: calculateTotal(),
      }
    };

    try {
      await axios.post('http://localhost:3001/api/estimates', estimateData);
      navigate('/dashboard/estimates');
    } catch (error) {
      console.error('Error submitting estimate:', error);
    }
  };

  return (
    <div className='flex'>
      <div className="w-1/5">
        <SidePanel />
      </div>
      <div className="estimate-container">
        <h2 className="text-2xl font-semibold mb-10 mt-20 text-gray-700">New Quote</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Customer Name*</label>
            <select value={customer} onChange={(e) => handleDropdownChange(e, setCustomer, 'sales/customers')}>
              <option value="">Select a customer</option>
              {customers.map((cust) => (
                <option key={cust.id} value={cust.name}>{cust.name}</option>
              ))}
              <option value="new sales/customers">Add New Customer</option>
            </select>
          </div>

          <div className="form-group">
            <label>Quote#</label>
            <input type="text" value={quoteNumber} onChange={(e) => setQuoteNumber(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Reference#</label>
            <input type="text" value={reference} onChange={(e) => setReference(e.target.value)} />
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
            <label>Salesperson</label>
            <select value={salesperson} onChange={(e) => handleDropdownChange(e, setSalesperson, 'sales/salespersons')}>
              <option value="">Select a salesperson</option>
              {salespeople.map((sp) => (
                <option key={sp.id} value={sp.name}>{sp.name}</option>
              ))}
              <option value="new sales/salespersons">Add New Salesperson</option>
            </select>
          </div>

          <div className="form-group">
            <label>Project Name</label>
            <select value={projectName} onChange={(e) => handleDropdownChange(e, setProjectName, 'projects')}>
              <option value="">Select a project</option>
              {projects.map((proj) => (
                <option key={proj.id} value={proj.name}>{proj.name}</option>
              ))}
              <option value="new projects">Add New Project</option>
            </select>
          </div>

          <div className="form-group">
            <label>Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="items-table">
            <h2 className="text-xl font-semibold mb-6 text-gray-700">Items</h2>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Rate</th>
                  <th>Discount (%)</th>
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
                      >
                        <option value="" hidden>Select an item</option>
                        <option value="new item" className='text-blue-500'>Add New Item</option>
                        {availableItems.map((it) => (
                          <option key={it.id} value={it.name}>{it.name}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        min="0"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={item.rate}
                        onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                        min="0"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={item.discount}
                        onChange={(e) => handleItemChange(index, 'discount', e.target.value)}
                        min="0"
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
                    <td>{(item.quantity * item.rate * (1 - item.discount / 100)).toFixed(2)}</td>
                    <td>
                      <button type="button" onClick={() => removeItem(index)}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button type="button" onClick={addNewItem}>Add New Item</button>
          </div>

          <div className="subtotal-section">
            <h2 className="text-xl font-semibold mb-6 text-gray-700">Subtotal Details</h2>
            <div className="subtotal-container">
              <div className="summary">
                <div>Subtotal: ₹ {calculateSubtotal().toFixed(2)}</div>
                <br />
              </div>

              <div className="form-group">
                <label>Tax Type</label>
                <select value={taxType} onChange={(e) => setTaxType(e.target.value)}>
                  <option value="" >Select a tax type</option>
                  <option value="tds">TDS</option>
                  <option value="tcs">TCS</option>
                </select>
              </div>

              {taxType === 'tds' && (
                <div className="form-group">
                  <label>Select TDS Type and Rate</label>
                  <select value={showCustomTax ? 'Others' : tax} onChange={handleTaxChange}>
                    <option value="" >Select Tax</option>
                    <option value="5">Commission or Brokerage [5%]</option>
                    <option value="3.75">Commission or Brokerage (Reduced) [3.75%]</option>
                    <option value="10">Dividend [10%]</option>
                    <option value="7.5">Dividend (Reduced) [7.5%]</option>
                    <option value="2">Payment of contractors for Others [2%]</option>
                    <option value="1.5">Payment of contractors for Others (Reduced) [1.5%]</option>
                    <option value="1">Payment of contractors HUF/Indiv [1%]</option>
                    <option value="0.75">Payment of contractors HUF/Indiv (Reduced) [0.75%]</option>
                    <option value="10">Professional Fees [10%]</option>
                    <option value="7.5">Professional Fees (Reduced) [7.5%]</option>
                    <option value="Others">Others</option>
                  </select>
                  {showCustomTax && (
                    <div>
                      <label>Custom TDS Rate (%)</label>
                      <input type="number" value={customTax} onChange={handleCustomTaxChange} />
                    </div>
                  )}
                </div>
              )}

              {taxType === 'tcs' && (
                <div>
                  <label>Enter TCS Tax Rate (%)</label>
                  <input type="number" value={customTax} onChange={handleCustomTaxChange} />
                </div>
              )}

              <div className="summary">
                <div>Tax Amount: ₹ {taxType === 'tcs' ? (calculateSubtotal() * (customTax / 100)).toFixed(2) : calculateTaxAmount()}</div>
                <br />
              </div>

              <div className="form-group">
                <label>Adjustment</label>
                <select value={adjustmentType} onChange={(e) => setAdjustmentType(e.target.value)}>
                  <option value="add">Add</option>
                  <option value="subtract">Subtract</option>
                </select>

                <input
                  type="number"
                  value={adjustment}
                  onChange={(e) => setAdjustment(e.target.value)}
                  placeholder="Adjustment amount"
                  min="0"
                />
              </div>

              <div className="summary">
                <div>Total: ₹ {calculateTotal()}</div>
              </div>
            </div>
          </div>

          <div className="actions">
            <button type="submit">Save and Send</button>
            <button type="button" onClick={() => navigate('/dashboard/estimates')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Estimate;
