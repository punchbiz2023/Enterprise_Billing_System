import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidepanel.css'; // Import the CSS file

const SidePanel = () => {
  const [activeLink, setActiveLink] = useState('/dashboard/purchase/vendors');

  const handleLinkClick = (path) => {
    setActiveLink(path);
  };

  return (
    <div className="side-panel">
      <ul className="space-y-4">
        <li>
          <Link
            to="/dashboard/purchase/vendors"
            className={`block p-2 ${activeLink === '/dashboard/purchase/vendors' ? 'active' : ''}`}
            onClick={() => handleLinkClick('/dashboard/purchase/vendors')}
          >
            Vendors
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard/purchase/expense"
            className={`block p-2 ${activeLink === '/dashboard/purchase/expense' ? 'active' : ''}`}
            onClick={() => handleLinkClick('/dashboard/purchase/expense')}
          >
            Expenses
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard/purchase/order"
            className={`block p-2 ${activeLink === '/dashboard/purchase/order' ? 'active' : ''}`}
            onClick={() => handleLinkClick('/dashboard/purchase/order')}
          >
            Order
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard/purchase/bill"
            className={`block p-2 ${activeLink === '/dashboard/purchase/bill' ? 'active' : ''}`}
            onClick={() => handleLinkClick('/dashboard/purchase/bill')}
          >
            Bills
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard/purchase/payment-done"
            className={`block p-2 ${activeLink === '/dashboard/purchase/payment-done' ? 'active' : ''}`}
            onClick={() => handleLinkClick('/dashboard/purchase/payment-done')}
          >
            Payment Done
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SidePanel;
