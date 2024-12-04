import React, { useState } from 'react';
import axios from 'axios';

const Journal = () => {
  const [date, setDate] = useState('');
  const [journalNumber, setJournalNumber] = useState('1');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [isCashBased, setIsCashBased] = useState(false);
  const [currency, setCurrency] = useState('INR - Indian Rupee');
  const [entries, setEntries] = useState([{ account: '', description: '', contact: '', debit: '', credit: '' }]);
  const [attachments, setAttachments] = useState([]);
  const [subtotal, setSubtotal] = useState({ debit: 0, credit: 0 });
  const [total, setTotal] = useState(0);

  const handleAddRow = () => {
    setEntries((prevEntries) => [...prevEntries, { account: '', description: '', contact: '', debit: '', credit: '' }]);
  };

  const handleRemoveRow = (index) => {
    setEntries((prevEntries) => prevEntries.filter((_, i) => i !== index));
  };

  const handleInputChange = (index, field, value) => {
    setEntries((prevEntries) => {
      const newEntries = [...prevEntries];
      newEntries[index][field] = value;
      return newEntries;
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Calculate totals before submitting
    const debitTotal = entries.reduce((sum, entry) => sum + Number(entry.debit || 0), 0);
    const creditTotal = entries.reduce((sum, entry) => sum + Number(entry.credit || 0), 0);

    const journalDetails = {
      date,
      journalNumber,
      description: notes,
      referenceNumber: reference,
      accounts: entries,
      totalDebit: debitTotal,
      totalCredit: creditTotal,
    };
    
    try {
      const response = await axios.post('https://enterprisebillingsystem.onrender.com/api/journals', journalDetails);
    } catch (error) {
      console.error('Error creating Journal:', error);
      console.error('Response:', error.response);
    }

    // Update subtotal and total state
    setSubtotal({ debit: debitTotal, credit: creditTotal });
    setTotal(debitTotal - creditTotal);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg max-w-5xl mx-auto mt-16">
      <h1 className="text-2xl font-bold mb-4">New Journal</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label>Date*</label>
            <input type="date" className="w-full border p-2" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div>
            <label>Journal#*</label>
            <input type="text" className="w-full border p-2" value={journalNumber} onChange={(e) => setJournalNumber(e.target.value)} required />
          </div>
          <div>
            <label>Reference#</label>
            <input type="text" className="w-full border p-2" value={reference} onChange={(e) => setReference(e.target.value)} />
          </div>
          <div>
            <label>Notes*</label>
            <textarea className="w-full border p-2" maxLength="500" value={notes} onChange={(e) => setNotes(e.target.value)} required />
          </div>
        </div>

        <div className="mb-4">
          <label>
            <h2>Journal Type</h2>
            <input type="checkbox" checked={isCashBased} onChange={(e) => setIsCashBased(e.target.checked)} />
            <span className="ml-2">Cash based journal</span>
          </label>
        </div>

        <div className="mb-4">
          <label>Currency</label>
          <select className="w-full border p-2" value={currency} onChange={(e) => setCurrency(e.target.value)}>
            <option value="INR - Indian Rupee">INR - Indian Rupee</option>
            <option value="USD - US Dollar">USD - US Dollar</option>
          </select>
        </div>

        <div className="mb-4">
          <label>Journal Entries</label>
          <table className="w-full border mt-2">
            <thead>
              <tr>
                <th className="border p-2">Account</th>
                <th className="border p-2">Description</th>
                <th className="border p-2">Contact (INR)</th>
                <th className="border p-2">Debits</th>
                <th className="border p-2">Credits</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={index}>
                  <td className="border p-2">
                    <select
                      className="w-full"
                      value={entry.account}
                      onChange={(e) => handleInputChange(index, 'account', e.target.value)}
                    >
                      <option value="">Select Account</option>
                      <option value="abc">ABC</option>
                    </select>
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      className="w-full"
                      value={entry.description}
                      onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                    />
                  </td>
                  <td className="border p-2">
                    <select
                      className="w-full"
                      value={entry.contact}
                      onChange={(e) => handleInputChange(index, 'contact', e.target.value)}
                    >
                      <option value="">Select Contact</option>
                      <option value="PunchBiz">PunchBiz</option>
                    </select>
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      className="w-full"
                      value={entry.debit}
                      onChange={(e) => handleInputChange(index, 'debit', e.target.value)}
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      className="w-full"
                      value={entry.credit}
                      onChange={(e) => handleInputChange(index, 'credit', e.target.value)}
                    />
                  </td>
                  <td className="border p-2 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveRow(index)}
                      className="text-red-500"
                    >
                      &times;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" onClick={handleAddRow} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
            Add New Row
          </button>
        </div>

        <div className="mb-4">
          <label>Subtotal</label>
          <p>Debits: {subtotal.debit.toFixed(2)}</p>
          <p>Credits: {subtotal.credit.toFixed(2)}</p>
          <p className="text-red-500">Total: {total.toFixed(2)}</p>
        </div>

        <div className="mb-4">
          <label>Attachments</label>
          <input type="file" multiple onChange={handleFileChange} />
          <small className="block text-gray-500">You can upload a maximum of 5 files, 10MB each</small>
        </div>

        <button type="submit" className="mt-4 w-full px-4 py-2 bg-green-500 text-white rounded">
          Save Journal
        </button>
      </form>
    </div>
  );
};

export default Journal;
