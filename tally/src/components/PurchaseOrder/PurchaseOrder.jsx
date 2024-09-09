import React, { useState, useEffect } from 'react';
import './PurchaseOrder.css';

const PurchaseOrder = () => {
    const [vendor, setVendor] = useState('');
    const [customer, setCustomer] = useState('');
    const [deliveryType, setDeliveryType] = useState('organization');
    const [purchaseOrderNo, setPurchaseOrderNo] = useState('PO-00001');
    const [reference, setReference] = useState('');
    const [date, setDate] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');
    const [paymentTerms, setPaymentTerms] = useState('Due on Receipt');
    const [shipmentPreference, setShipmentPreference] = useState('');
    const [items, setItems] = useState([{ id: 1, account: '', quantity: 1, rate: 0, amount: 0 }]);
    const [discountType, setDiscountType] = useState('%');
    const [taxType, setTaxType] = useState('');
    const [tcsTds, setTcsTds] = useState('TCS');

    useEffect(() => {
        const currentDate = new Date().toLocaleDateString('en-GB');
        setDate(currentDate);
    }, []);

    const removeItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    return (
        <div className="purchase-order-container">
            <h2 className="text-2xl font-semibold mb-10 mt-20 text-gray-700">New Purchase Order</h2>

            <div className="vendor-section">
                <label>Vendor Name*</label>
                <select value={vendor} onChange={(e) => setVendor(e.target.value)}>
                    <option>Select a Vendor</option>
                </select>
            </div>

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
                <select value={customer} onChange={(e) => setCustomer(e.target.value)}>
                    <option>Select Customer</option>
                </select>
            </div>

            <div className="purchase-order-details">
                <label>Purchase Order#</label>
                <input type="text" value={purchaseOrderNo} readOnly />
                <label>Reference#</label>
                <input type="text" value={reference} onChange={(e) => setReference(e.target.value)} />
                <label>Date</label>
                <input type="text" value={date} readOnly />
                <label>Expected Delivery Date</label>
                <input
                    type="text"
                    placeholder="dd/mm/yyyy"
                    value={deliveryDate}
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

                <label>Shipment Preference</label>
                <input type="text" placeholder="Choose the shipment preference" value={shipmentPreference} onChange={(e) => setShipmentPreference(e.target.value)} />
            </div>

            <div className="item-table">
                <label>Item Table</label>
                <table>
                    <thead>
                        <tr>
                            <th>Item Details</th>
                            <th>Account</th>
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
                                    <select value={item.account} onChange={(e) => setItems(prevItems => {
                                        const updatedItems = [...prevItems];
                                        updatedItems[index].account = e.target.value;
                                        return updatedItems;
                                    })}>
                                        <option>Select an account</option>
                                    </select>
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

            <div className="discount-section">
                <label>Discount</label>
                <select value={discountType} onChange={(e) => setDiscountType(e.target.value)}>
                    <option value="%">%</option>
                    <option value="₹">₹</option>
                </select>
            </div>

            <div className="tax-section">
                <label>Tax Type</label>
                <select value={taxType} onChange={(e) => setTaxType(e.target.value)}>
                    <option value="Commission/Brokerage">Commission or Brokerage [5%]</option>
                    <option value="Commission/Brokerage_Reduced">Commission or Brokerage (Reduced) [3.75%]</option>
                    <option value="Dividend">Dividend [10%]</option>
                    <option value="Dividend_Reduced">Dividend (Reduced) [7.5%]</option>
                    <option value="Interest">Other Interest than securities [10%]</option>
                    <option value="Interest_Reduced">Other Interest than securities (Reduced) [7.5%]</option>
                    <option value="Contractor_Others">Payment of contractors for Others [2%]</option>
                    <option value="Contractor_Others_Reduced">Payment of contractors for Others (Reduced) [1.5%]</option>
                    <option value="Contractor_HUF">Payment of contractors HUF/Indiv [1%]</option>
                    <option value="Contractor_HUF_Reduced">Payment of contractors HUF/Indiv (Reduced) [0.75%]</option>
                    <option value="Professional_Fees">Professional Fees [10%]</option>
                    <option value="Professional_Fees_Reduced">Professional Fees (Reduced) [7.5%]</option>
                    <option value="Rent_Land">Rent on land or furniture etc [10%]</option>
                    <option value="Rent_Land_Reduced">Rent on land or furniture etc (Reduced) [7.5%]</option>
                    <option value="Technical_Fees">Technical Fees [2%]</option>
                </select>
            </div>

            <div className="tcs-tds-section">
                <label>TCS or TDS</label>
                <div className="radio-group">
                    <input
                        type="radio"
                        name="tcs-tds"
                        value="TCS"
                        checked={tcsTds === 'TCS'}
                        onChange={(e) => setTcsTds(e.target.value)}
                    />
                    <label htmlFor="tcs">TCS</label>
                    <input
                        type="radio"
                        name="tcs-tds"
                        value="TDS"
                        checked={tcsTds === 'TDS'}
                        onChange={(e) => setTcsTds(e.target.value)}
                    />
                    <label htmlFor="tds">TDS</label>
                </div>
            </div>
            <div className="actions">
          <button>Save as Draft</button>
          <button>Save and Send</button>
          <button>Cancel</button>
        </div>
        </div>
    );
};

export default PurchaseOrder;
