import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './estimate.css';
import SidePanel from '../sales/sidepanel';

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
  const [items, setItems] = useState([{ item: '', quantity: 1, rate: 0, discount: 0, amount: 0 }]);
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

    // const fetchSalespeople = async () => {
    //   try {
    //     const response = await axios.get('http://localhost:3001/api/salespeople');
    //     setSalespeople(response.data);
    //   } catch (error) {
    //     console.error('Error fetching salesperson data:', error);
    //   }
    // };

    // const fetchProjects = async () => {
    //   try {
    //     const response = await axios.get('http://localhost:3001/api/projects');
    //     setProjects(response.data);
    //   } catch (error) {
    //     console.error('Error fetching project data:', error);
    //   }
    // };

    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/items');
        setAvailableItems(response.data);
      } catch (error) {
        console.error('Error fetching item data:', error);
      }
    };

    fetchCustomers();
    // fetchSalespeople();
    // fetchProjects();
    fetchItems();

    const currentDate = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
    setQuoteDate(currentDate);

  }, []);

  const addNewItem = () => {
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
        rate: selectedItem ? selectedItem.salesprice : 0, // Set the rate from the selected item
      };
    } else {
      updatedItems[index][field] = value;
    }
    if (value === 'new item') {
      navigate("/dashboard/items/form")
    }

    setItems(updatedItems);
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
    const taxAmount = calculateTaxAmount();
    const adjustedValue = adjustmentType === 'add' ? Number(adjustment) : -Number(adjustment);
    return (subtotal - Number(taxAmount) + adjustedValue).toFixed(2);
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
    } else {
      setShowCustomTax(false);
      setTax(Number(value));
    }
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
        tax: calculateTaxAmount(),
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
        <form>
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
              placeholder="Let your customer know what this quote is for"
            />
          </div>

          <div className="items-section">
            <label className="text-l font-semibold mb-6 text-gray-700">Item Table</label>
            <table>
              <thead>
                <tr>
                  <th>Item Details</th>
                  <th>Quantity</th>
                  <th>Rate</th>
                  <th>Discount (%)</th>
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
                        value={item.salesprice}
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

              <label className="text-xl font-semibold mb-6 text-gray-700">Select Tax:</label>
              <input
                type="radio"
                id="tds"
                name="taxType"
                value="TDS"
                checked={taxType === 'TDS'}
                onChange={() => setTaxType('TDS')}
              />
              <label htmlFor="tds">TDS</label>
              <input
                type="radio"
                id="tcs"
                name="taxType"
                value="TCS"
                checked={taxType === 'TCS'}
                onChange={() => setTaxType('TCS')}
              />
              <label htmlFor="tcs">TCS</label>
              <br /><br />
              <div className="form-group">
                <select value={showCustomTax ? 'Others' : tax} onChange={handleTaxChange}>
                  <option value="" disabled>Select Tax</option>
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
                  <input
                    type="number"
                    value={customTax}
                    onChange={(e) => setCustomTax(e.target.value)}
                    min="0"
                    placeholder="Enter custom tax percentage"
                  />
                )}
              </div>

              <div className="summary">
                <div>Tax Amount: ₹ {calculateTaxAmount()}</div><br />
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
            <button type="button" onClick={handleSubmit}>Save and Send</button>
            <button type="button">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Estimate;
