import React, { useState, useEffect } from 'react';
import './PurchaseOrder.css';
import SidePanel from '../Purchase/Sidepanel';
import * as XLSX from 'xlsx';

const PurchaseOrder = () => {
    const [vendor, setVendor] = useState('');
    const [vendors, setVendors] = useState([]);  
    const [deliveryType, setDeliveryType] = useState('organization');
    const [purchaseOrderNo, setPurchaseOrderNo] = useState('PO-00001');
    const [reference, setReference] = useState('');
    const [date, setDate] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');
    const [paymentTerms, setPaymentTerms] = useState('Due on Receipt');
    const [shipmentPreference, setShipmentPreference] = useState('');
    const [items, setItems] = useState([{ id: 1, account: '', quantity: 1, rate: 0, amount: 0 }]);
    const [gstPercentage, setGstPercentage] = useState(0);
    const [gstAmount, setGstAmount] = useState(0);
    const [subtotal, setSubtotal] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);
    const [vendorEmail, setVendorEmail] = useState('');

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

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/vendor');
                const data = await response.json();
                setVendors(data);
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

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formattedDate = new Date(date.split('/').reverse().join('-')).toISOString().split('T')[0];
        const formattedDeliveryDate = new Date(deliveryDate.split('/').reverse().join('-')).toISOString().split('T')[0];

        const orderData = {
            name: vendor,
            delivery: deliveryType,
            orderno: purchaseOrderNo,
            ref: reference,
            date: formattedDate,
            deliverydate: formattedDeliveryDate,
            terms: paymentTerms,
            modeofshipment: shipmentPreference,
            itemdetails: items,
            gst: gstPercentage,
            total: grandTotal,
            vendorEmail: vendorEmail // Include vendor email in the order data
        };

        try {
            const response = await fetch('http://localhost:3001/api/purchaseorder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (response.ok) {
                alert("Order has been successfully sent to the vendor's email.");
                // Optionally, reset the form here
            } else {
                alert("Failed to send the order. Please try again.");
            }
        } catch (error) {
            console.error('Error posting order data:', error);
            alert("An error occurred while sending the order.");
        }
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(items.map(item => ({
            'Item Name': item.account,  
            'Quantity': item.quantity,
            'Rate': item.rate,
            'Amount': (parseFloat(item.rate) * parseFloat(item.quantity)).toFixed(2)
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Items');
        XLSX.writeFile(workbook, 'PurchaseOrderItems.xlsx');
    };

    return (
        <div>
            <div>
                <SidePanel/>
            </div>
            <div className="purchase-order-container">
                <h2 className="text-2xl font-semibold mb-10 mt-20 text-gray-700">New Purchase Order</h2>

                <form onSubmit={handleSubmit}>
                    {/* Vendor Selection */}
                    <div className="vendor-section">
                        <label>Vendor Name</label>
                        <select value={vendor} onChange={(e) => setVendor(e.target.value)} required>
                            <option value="">Select a Vendor</option>
                            {vendors.map((vendor) => (
                                <option key={vendor.id} value={vendor.name}>
                                    {vendor.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Delivery Type */}
                    <div className="delivery-section">
                        <label>Delivery Address*</label>
                        <div className="radio-group">
                            <input
                                type="radio"
                                name="address"
                                id="organization"
                                value="organization"
                                checked={deliveryType === 'organization'}
                                onChange={() => setDeliveryType('organization')}
                            />
                            <label htmlFor="organization">Organization</label>
                            <input
                                type="radio"
                                name="address"
                                id="customer"
                                value="customer"
                                checked={deliveryType === 'customer'}
                                onChange={() => setDeliveryType('customer')}
                            />
                            <label htmlFor="customer">Customer</label>
                        </div>
                    </div>

                    {/* Purchase Order Details */}
                    <div className="purchase-order-details">
                        <label>Purchase Order#</label>
                        <input type="text" value={purchaseOrderNo} required readOnly />
                        
                        <label>Reference#</label>
                        <input 
                            type="text" 
                            value={reference} 
                            placeholder='Enter the reference id' 
                            required 
                            onChange={(e) => setReference(e.target.value)} 
                        />
                        
                        <label>Date</label>
                        <input type="text" value={date} readOnly required/>
                        
                        <label>Expected Delivery Date</label>
                        <input
                            type="date"
                            placeholder="dd/mm/yyyy"
                            value={deliveryDate}
                            onChange={(e) => setDeliveryDate(e.target.value)}
                        />
                        
                        <label>Payment Terms</label>
                        <select 
                            className="payment-terms-dropdown" 
                            value={paymentTerms} 
                            onChange={(e) => setPaymentTerms(e.target.value)}
                        >
                            <option value="net15">Net 15</option>
                            <option value="net30">Net 30</option>
                            <option value="net45">Net 45</option>
                            <option value="net60">Net 60</option>
                            <option value="endOfMonth">Due end of the month</option>
                            <option value="endOfNextMonth">Due end of next month</option>
                            <option value="dueOnReceipt">Due on Receipt</option>
                        </select>

                        <label>Shipment Preference</label>
                        <input 
                            type="text" 
                            placeholder="Choose the shipment preference" 
                            required 
                            value={shipmentPreference} 
                            onChange={(e) => setShipmentPreference(e.target.value)} 
                        />
                    </div>

                    {/* Items Table */}
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
                                            <input 
                                                type="text" 
                                                placeholder="Type or click to select an item." 
                                                value={item.account} 
                                                onChange={(e) => setItems(prevItems => {
                                                    const updatedItems = [...prevItems];
                                                    updatedItems[index].account = e.target.value;
                                                    return updatedItems;
                                                })} 
                                                required
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                min="1"
                                                onChange={(e) => setItems(prevItems => {
                                                    const updatedItems = [...prevItems];
                                                    updatedItems[index].quantity = e.target.value;
                                                    return updatedItems;
                                                })}
                                                required
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={item.rate}
                                                min="0"
                                                step="0.01"
                                                onChange={(e) => setItems(prevItems => {
                                                    const updatedItems = [...prevItems];
                                                    updatedItems[index].rate = e.target.value;
                                                    return updatedItems;
                                                })}
                                                required
                                            />
                                        </td>
                                        <td>
                                            ₹ {(parseFloat(item.rate) * parseFloat(item.quantity)).toFixed(2)}
                                        </td>
                                        <td>
                                            <button type="button" onClick={() => removeItem(index)}>Remove</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button 
                            className="font-semibold text-blue-700" 
                            type="button" 
                            onClick={() => setItems([...items, { id: items.length + 1, account: '', quantity: 1, rate: 0, amount: 0 }])}
                        >
                            Add New Row
                        </button>
                    </div>

                    {/* Subtotal, GST, and Grand Total */}
                    <div className="subtotal-section">
                        <div className="my-4 p-4 border border-gray-300 rounded-md">
                            <div>
                                <label className="text-lg font-bold">Subtotal: </label>
                                <span>₹ {subtotal.toFixed(2)}</span>
                            </div>
                            <div className="gst-section">
                                <label className="text-lg font-bold">GST %: </label>
                                <input
                                    type="number"
                                    value={gstPercentage}
                                    min="0"
                                    onChange={(e) => setGstPercentage(e.target.value)}
                                    placeholder="Enter GST %"
                                />
                                <span>₹ {gstAmount.toFixed(2)}</span>
                            </div>
                            <div>
                                <label className="text-lg font-bold">Grand Total: </label>
                                <span>₹ {grandTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
{/* Vendor Email Input */}
<div className="form-group vendor-email-section">
    <label htmlFor="vendorEmail">Vendor Email</label>
    <input
        type="email"
        id="vendorEmail"
        value={vendorEmail}
        onChange={(e) => setVendorEmail(e.target.value)}
        placeholder="Enter vendor's email"
        required
        className="email-input"
    />
</div>

{/* Action Buttons */}
<div className="action-buttons-section">
    <button className="button submit-button" type="submit">
        Submit
    </button>
    <button 
        className="button export-button" 
        type="button" 
        onClick={exportToExcel}
    >
        Export to Excel
    </button>
</div>

                </form>
            </div>
        </div>
    );
};

export default PurchaseOrder;
