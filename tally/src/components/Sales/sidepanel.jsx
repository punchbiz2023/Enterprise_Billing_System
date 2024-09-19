import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './sidepanel.css'; // Import the CSS file

const SidePanel = () => {
  const [activeLink, setActiveLink] = useState('');

  const handleLinkClick = (path) => {
    setActiveLink(path);
  };

  return (
    <div className="side-panel">
      <ul>
        <li>
          <Link
            to="/dashboard/sales/customers"
            className={`side-link ${activeLink === '/dashboard/sales/customers' ? 'active' : ''}`}
            onClick={() => handleLinkClick('/dashboard/sales/customers')}
          >
            Customers
          </Link>

        </li>
        <li>
          <Link
            to="/dashboard/sales/invoice"
            className={`block ${activeLink === '/dashboard/sales/invoice' ? 'active' : ''}`}
            onClick={() => handleLinkClick('/dashboard/sales/invoice')}
          >
            Invoice
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard/sales/order"
            className={`block ${activeLink === '/dashboard/sales/order' ? 'active' : ''}`}
            onClick={() => handleLinkClick('/dashboard/sales/order')}
          >
            Order
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard/sales/estimate"
            className={`block ${activeLink === '/dashboard/sales/estimate' ? 'active' : ''}`}
            onClick={() => handleLinkClick('/dashboard/sales/estimate')}
          >
            Estimate
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard/sales/delivery"
            className={`block ${activeLink === '/dashboard/sales/delivery' ? 'active' : ''}`}
            onClick={() => handleLinkClick('/dashboard/sales/delivery')}
          >
            Delivery Challan
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard/sales/payment-received"
            className={`block ${activeLink === '/dashboard/sales/payment-received' ? 'active' : ''}`}
            onClick={() => handleLinkClick('/dashboard/sales/payment-received')}
          >
            Payment Received
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SidePanel;
