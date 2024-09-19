import React, { useState, useEffect } from 'react';
import './BillForm.css';
import SidePanel from '../Purchase/Sidepanel';

const BillForm = () => {
    const [vendor, setVendor] = useState('');
    const [vendors, setVendors] = useState([]);  // State to hold vendor list
    const [customer, setCustomer] = useState('');
    const [deliveryType, setDeliveryType] = useState('organization');
    const [billNo, setbillNo] = useState('');
    const [reference, setReference] = useState('');
    const [date, setDate] = useState('');
    const [dueDate, setdueDate] = useState('');
    const [paymentTerms, setPaymentTerms] = useState('');
    const [shipmentPreference, setShipmentPreference] = useState('');
    const [items, setItems] = useState([{ id: 1, account: '', quantity: 1, rate: 0, amount: 0 }]);
    const [discountType, setDiscountType] = useState('%');
    const [taxType, setTaxType] = useState('');
    const [tcsTds, setTcsTds] = useState('TCS');
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

    // Fetch vendor data from API
    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/vendor');
                const data = await response.json();
                setVendors(data); // Assuming the response is an array of vendor objects
            } catch (error) {
                console.error('Error fetching vendor data:', error);
            }
        };

        fetchVendors();
    }, []);

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

    return (
    <div>
        <div>
            <SidePanel/>
        </div>
        <div className="purchase-order-container">
            <h2 className="text-2xl font-semibold mb-10 mt-20 text-gray-700">Create Bill</h2>

            <div className="vendor-section">
                <label>Vendor Name*</label>
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
                <input type="text" value={billNo} />
                <label>Order Number</label>
                <input type="text" value={reference} onChange={(e) => setReference(e.target.value)} />
                <label>Bill Date</label>
                <input type="date" />
                <label>Due Date</label>
                <input
                    type="date"
                    placeholder="dd/mm/yyyy"
                    value={dueDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
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
                                    <input type="text" placeholder="Type or click to select an item." />
                                </td>
                                
                                <td>
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => setItems(prevItems => {
                                            const updatedItems = [...prevItems];
                                            updatedItems[index].quantity = e.target.value;
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
                                            updatedItems[index].rate = e.target.value;
                                            return updatedItems;
                                        })}
                                    />
                                </td>
                                <td>
                                    {parseFloat(item.rate) * parseFloat(item.quantity)}
                                </td>
                                <td><button type="button" onClick={() => removeItem(index)}>Remove</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button className="font-semibold text-blue-700" onClick={() => setItems([...items, { id: items.length + 1, account: '', quantity: 1, rate: 0, amount: 0 }])}>Add New Row</button>
            </div>

            <div className="subtotal-section">
                <div>
                    <label>Subtotal: </label>
                    <span>₹ {subtotal.toFixed(2)}</span>
                </div><br/>
                <div className="gst-section">
                    <label>GST (%): </label>
                    <input
                        type="number"
                        value={gstPercentage}
                        onChange={(e) => setGstPercentage(parseFloat(e.target.value))}
                    /><br/><br/>
                    <div>
                        <label>GST Amount: </label>
                        <span>₹ {gstAmount.toFixed(2)}</span>
                    </div><br/>
                </div>
                <div>
                    <label>Grand Total: </label>
                    <span>₹ {grandTotal.toFixed(2)}</span>
                </div>
            </div>

            <div className="actions">
                <button>Save and Send</button>
                <button>Cancel</button>
            </div>
        </div>
        </div>
    );
};

export default BillForm;