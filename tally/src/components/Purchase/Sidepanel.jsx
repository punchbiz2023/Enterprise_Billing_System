import React from 'react';
import { Link } from 'react-router-dom';
import './SidePanel.css'; 

const SidePanel = () => {
  return (
    <div className="side-panel">
      
      <ul>
        <li><Link to="/dashboard/purchase/vendors">Vendors</Link></li>
        <li><Link to="/dashboard/purchase/expense">Expenses</Link></li>
        <li><Link to="/dashboard/purchase/order">Order</Link></li>
        <li><Link to="/dashboard/purchase/bill">Bills</Link></li>
        <li><Link to="/dashboard/purchase/payment-done">Payment Done</Link></li>
      </ul>
    </div>
  );
};

export default SidePanel;
