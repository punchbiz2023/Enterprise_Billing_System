import React, { useState, useEffect } from 'react';
import './BillForm.css';
import { jwtDecode } from 'jwt-decode'
import SidePanel from '../Purchase/Sidepanel';
import axios from 'axios';

const BillForm = () => {
    const [vendor, setVendor] = useState('');
    const [vendors, setVendors] = useState([]);
    const [billNo, setBillNo] = useState('');
    const [reference, setReference] = useState('');
    const [date, setDate] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [paymentTerms, setPaymentTerms] = useState('');
    const [shipmentPreference, setShipmentPreference] = useState('');
    const [items, setItems] = useState([{ id: 1, iname: '', quantity: 1, rate: 0, amount: 0 }]);
    const [gstPercentage, setGstPercentage] = useState(0);
    const [gstAmount, setGstAmount] = useState(0);
    const [subtotal, setSubtotal] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);

    useEffect(() => {
        const currentDate = new Date().toLocaleDateString('en-GB');
        setDate(currentDate);
    }, []);

    useEffect(() => {
        calculateSubtotal();
    }, [items]);

    useEffect(() => {
        calculateGstAndGrandTotal();
    }, [subtotal, gstPercentage]);
    const [loggedUser, setLoggedUser] = useState(null);
    useEffect(() => {
        const token = localStorage.getItem("accessToken")
        const decoded = jwtDecode(token)

        setLoggedUser(decoded.email);

    }, []);
    useEffect(() => {
        if (loggedUser) {
            fetchVendors(loggedUser);
        }
    }, [loggedUser]);
    const fetchVendors = async (loggedUser) => {
        try {
            const response = await axios.get('https://enterprisebillingsystem.onrender.com/api/vendor', {
                params: { loggedUser }
            });
            setVendors(response.data);
        } catch (error) {
            console.error('Error fetching vendor data:', error);
        }
    };

    const calculateSubtotal = () => {
        const total = items.reduce((acc, item) => acc + (parseFloat(item.rate) * parseFloat(item.quantity)), 0);
        setSubtotal(total);
    };

    const calculateGstAndGrandTotal = () => {
        const gst = (subtotal * gstPercentage) / 100;
        setGstAmount(gst);
        setGrandTotal(subtotal + gst);
    };

    const removeItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!vendor) {
            alert('Please select a vendor.');
            return;
        }

        if (!billNo) {
            alert('Please enter a bill number.');
            return;
        }

        if (!reference) {
            alert('Please enter an order number.');
            return;
        }

        if (!dueDate) {
            alert('Please select a due date.');
            return;
        }

        const today = new Date();
        const selectedDueDate = new Date(dueDate);
        if (selectedDueDate <= today) {
            alert('Due date must be a future date.');
            return;
        }

        const hasInvalidItems = items.some(item => !item.iname || item.quantity <= 0 || item.rate <= 0);
        if (hasInvalidItems) {
            alert('Please ensure all items names are provided, quantity greater than 0, and rate greater than 0.');
            return;
        }

        alert("Your order has been successfully sent");

        const formattedDate = new Date(date.split('/').reverse().join('-')).toISOString().split('T')[0];
        const formattedDeliveryDate = new Date(dueDate.split('/').reverse().join('-')).toISOString().split('T')[0];

        const billData = {
            name: vendor,
            billnumber: billNo,
            orderno: reference,
            billdate: formattedDate,
            duedate: formattedDeliveryDate,
            terms: paymentTerms,
            modeofshipment: shipmentPreference,
            itemdetails: items,
            gst: gstPercentage,
            total: grandTotal
        };

        const data = { ...billData, loggedUser }

        try {
            const response = await axios.post('https://enterprisebillingsystem.onrender.com/api/bill', data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('Bill posted successfully:', response.data);
        } catch (error) {
            console.error('Error posting Bill:', error);
        }
    };

    return (
        <div>
            <div>
                <SidePanel />
            </div>
            <div className="purchase-order-container">
                <h2 className="text-2xl font-semibold mb-10 mt-20 text-gray-700">Create Bill</h2>

                <div className="vendor-section">
                    <label>Vendor Name</label>
                    <select value={vendor} onChange={(e) => setVendor(e.target.value)}>
                        <option value="">Select a Vendor</option>
                        {vendors.map((vendor) => (
                            <option key={vendor.id} value={vendor.name}>
                                {vendor.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="purchase-order-details">
                    <label>Bill Number</label>
                    <input type="text" value={billNo} placeholder='Enter Bill Number' required onChange={(e) => setBillNo(e.target.value)} />
                    <label>Order Number</label>
                    <input type="text" value={reference} placeholder='Enter Order Number' required onChange={(e) => setReference(e.target.value)} />
                    <label>Bill Date</label>
                    <input type="text" value={date} readOnly />
                    <label>Due Date</label>
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]} // Set minimum date to today
                    />
                    <label>Payment Terms</label>
                    <select className="payment-terms-dropdown" value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)}>
                        <option value="net15">Net 15</option>
                        <option value="net30">Net 30</option>
                        <option value="net45">Net 45</option>
                        <option value="net60">Net 60</option>
                        <option value="endOfMonth">Due end of the month</option>
                        <option value="endOfNextMonth">Due end of next month</option>
                        <option value="dueOnReceipt">Due on Receipt</option>
                    </select>
                </div>

                <div className="item-table">
                    <label>Item Table</label>
                    <table>
                        <thead>
                            <tr>
                                <th>Item Details</th>
                                <th>Quantity</th>
                                <th>Rate</th>
                                <th>Amount</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={item.id}>
                                    <td>
                                        <input type="text" placeholder="Type or click to select an item." onChange={(e) => {
                                            item.iname = e.target.value;
                                            console.log(item.iname);

                                        }} />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => setItems(prevItems => {
                                                const updatedItems = [...prevItems];
                                                const quantity = e.target.value;
                                                const rate = updatedItems[index].rate;
                                                updatedItems[index].quantity = quantity;
                                                updatedItems[index].amount = parseFloat(quantity) * parseFloat(rate);
                                                return updatedItems;
                                            })}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={item.rate}
                                            onChange={(e) => setItems(prevItems => {
                                                const updatedItems = [...prevItems];
                                                const rate = e.target.value;
                                                const quantity = updatedItems[index].quantity;
                                                updatedItems[index].rate = rate;
                                                updatedItems[index].amount = parseFloat(quantity) * parseFloat(rate);
                                                return updatedItems;
                                            })}
                                        />
                                    </td>
                                    <td>{item.amount.toFixed(2)}</td>

                                    <td><button type="button" onClick={() => removeItem(index)}>Remove</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button className="font-semibold text-blue-700" onClick={() => setItems([...items, { id: items.length + 1, account: '', quantity: 1, rate: 0, amount: 0 }])}>
                        Add New Row
                    </button>
                </div>

                <div className="subtotal-section">
                    <div>
                        <label>Subtotal: </label>
                        <span>₹ {subtotal.toFixed(2)}</span>
                    </div><br />
                    <div className="gst-section">
                        <label>GST (%): </label>
                        <input
                            type="number"
                            value={gstPercentage}
                            onChange={(e) => setGstPercentage(parseFloat(e.target.value))}
                        /><br /><br />
                        <div>
                            <label>GST Amount: </label>
                            <span>₹ {gstAmount.toFixed(2)}</span>
                        </div><br />
                    </div>
                    <div>
                        <label>Grand Total: </label>
                        <span>₹ {grandTotal.toFixed(2)}</span>
                    </div>
                </div>

                <div className="actions">
                    <button onClick={handleSubmit}>Save and Send</button>
                    <button>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default BillForm;
