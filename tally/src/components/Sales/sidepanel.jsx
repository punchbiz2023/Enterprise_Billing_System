import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidepanel.css' // Import the CSS file

const SidePanel = () => {
  const location = useLocation();

  return (
    <div className="side-panel">
      <ul>
        <li>
          <Link
            to="/dashboard/sales/customers"
            className={`side-link ${location.pathname === '/dashboard/sales/customers' }`}
          >
            Customers
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard/sales/invoice"
            className={`side-link ${location.pathname === '/dashboard/sales/invoice' ? 'active' : ''}`}
          >
            Invoice
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard/sales/order"
            className={`side-link ${location.pathname === '/dashboard/sales/order' ? 'active' : ''}`}
          >
            Order
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard/sales/estimate"
            className={`side-link ${location.pathname === '/dashboard/sales/estimate' ? 'active' : ''}`}
          >
            Estimate
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard/sales/delivery"
            className={`side-link ${location.pathname === '/dashboard/sales/delivery' ? 'active' : ''}`}
          >
            Delivery Challan
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard/sales/credit"
            className={`side-link ${location.pathname === '/dashboard/sales/credit' ? 'active' : ''}`}
          >
            Credit Note
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SidePanel;
