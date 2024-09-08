import React, { useState } from 'react';
import './estimate.css';

const Estimate = () => {
  const [customer, setCustomer] = useState('');
  const [quoteNumber, setQuoteNumber] = useState('');
  const [quoteDate, setQuoteDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [salesperson, setSalesperson] = useState('');
  const [projectName, setProjectName] = useState('');
  const [subject, setSubject] = useState('');
  const [items, setItems] = useState([{ item: '', quantity: 1, rate: 0, discount: 0, amount: 0 }]);
  const [tax, setTax] = useState(0);
  const [adjustment, setAdjustment] = useState(0);

  const addNewItem = () => {
    setItems([...items, { item: '', quantity: 1, rate: 0, discount: 0, amount: 0 }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.rate - item.discount), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal + Number(tax) + Number(adjustment);
  };

  return (
    <div className="estimate-container">
      <h2 className="text-2xl font-semibold mb-10 mt-20 text-gray-700">New Quote</h2>
      <form>
        <div className="form-group">
          <label>Customer Name*</label>
          <input type="text" value={customer} onChange={(e) => setCustomer(e.target.value)} placeholder="Select or add a customer" />
        </div>

        <div className="form-group">
          <label>Quote#</label>
          <input type="text" value={quoteNumber} onChange={(e) => setQuoteNumber(e.target.value)} />
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
          <input type="text" value={salesperson} onChange={(e) => setSalesperson(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Project Name</label>
          <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Subject</label>
          <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Let your customer know what this quote is for" />
        </div>

        <div className="items-section">
          <label>Item Table</label>
          <table>
            <thead>
              <tr>
                <th>Item Details</th>
                <th>Quantity</th>
                <th>Rate</th>
                <th>Discount</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td><input type="text" value={item.item} onChange={(e) => handleItemChange(index, 'item', e.target.value)} /></td>
                  <td><input type="number" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} /></td>
                  <td><input type="number" value={item.rate} onChange={(e) => handleItemChange(index, 'rate', e.target.value)} /></td>
                  <td><input type="number" value={item.discount} onChange={(e) => handleItemChange(index, 'discount', e.target.value)} /></td>
                  <td>{(item.quantity * item.rate - item.discount).toFixed(2)}</td>
                  <td><button type="button" onClick={() => removeItem(index)}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="font-semibold text-blue-700" type="button" onClick={addNewItem}>Add New Row</button>
        </div>

        <div className="subtotal-section">
          <h2 className="text-lg font-semibold mb-4">Subtotal Details</h2>
          <div className="subtotal-container">
          <div className="form-group">
  <label>Select Tax (TDS/TCS)</label>
  <select value={tax} onChange={(e) => setTax(e.target.value)}>
    <option value="">Select Tax</option>
    <option value="Commission or Brokerage [5%]">Commission or Brokerage [5%]</option>
    <option value="Commission or Brokerage (Reduced) [3.75%]">Commission or Brokerage (Reduced) [3.75%]</option>
    <option value="Dividend [10%]">Dividend [10%]</option>
    <option value="Dividend (Reduced) [7.5%]">Dividend (Reduced) [7.5%]</option>
    <option value="Other Interest than securities [10%]">Other Interest than securities [10%]</option>
    <option value="Other Interest than securities (Reduced) [7.5%]">Other Interest than securities (Reduced) [7.5%]</option>
    <option value="Payment of contractors for Others [2%]">Payment of contractors for Others [2%]</option>
    <option value="Payment of contractors for Others (Reduced) [1.5%]">Payment of contractors for Others (Reduced) [1.5%]</option>
    <option value="Payment of contractors HUF/Indiv [1%]">Payment of contractors HUF/Indiv [1%]</option>
    <option value="Payment of contractors HUF/Indiv (Reduced) [0.75%]">Payment of contractors HUF/Indiv (Reduced) [0.75%]</option>
    <option value="Professional Fees [10%]">Professional Fees [10%]</option>
    <option value="Professional Fees (Reduced) [7.5%]">Professional Fees (Reduced) [7.5%]</option>
    <option value="Rent on land or furniture etc [10%]">Rent on land or furniture etc [10%]</option>
    <option value="Rent on land or furniture etc (Reduced) [7.5%]">Rent on land or furniture etc (Reduced) [7.5%]</option>
    <option value="Technical Fees (2%) [2%]">Technical Fees (2%) [2%]</option>
  </select>
</div>


            <div className="form-group">
              <label>Adjustment</label>
              <input type="number" value={adjustment} onChange={(e) => setAdjustment(e.target.value)} placeholder="Adjustment amount" />
            </div>

            <div className="summary">
              <div>Subtotal: ₹ {calculateSubtotal().toFixed(2)}</div>
              <div>Total: ₹ {calculateTotal().toFixed(2)}</div>
            </div>
          </div>
        </div>

        <div className="actions">
          <button type="button">Save as Draft</button>
          <button type="button">Save and Send</button>
          <button type="button">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default Estimate;
