import React from 'react';
import { Link } from 'react-router-dom';
import './SidePanel.css'; // Import CSS for styling

const SidePanel = () => {
  return (
    <div className="side-panel">
      
      <ul>
        <li><Link to="/dashboard/sales/customers">Customers</Link></li>
        <li><Link to="/dashboard/sales/invoice">Invoice</Link></li>
        <li><Link to="/dashboard/sales/order">Order</Link></li>
        <li><Link to="/dashboard/sales/estimate">Estimate</Link></li>
        <li><Link to="/dashboard/sales/payment-received">Payment Received</Link></li>
      </ul>
    </div>
  );
};

export default SidePanel;
