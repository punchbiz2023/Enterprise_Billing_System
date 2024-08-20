import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <div className="navbar">
      <h2>Menu</h2>
      <ul>
        <li><Link to="/dashboard/items">Items</Link></li>
        <li><Link to="/dashboard/sales">Sales</Link></li>
        <li><Link to="/dashboard/purchase">Purchase</Link></li>
        <li><Link to="/dashboard/report">Report</Link></li>
      </ul>
    </div>
  );
};

export default Navbar;
