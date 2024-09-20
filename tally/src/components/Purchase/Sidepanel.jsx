import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidepanel.css'; // Import the CSS file

const SidePanel = () => {
  const location = useLocation();

  return (
    <div className="side-panel">
      <ul className="space-y-4">
        <li>
          <Link
            to="/dashboard/purchase/vendors"
            className={`block p-2 ${location.pathname === '/dashboard/purchase/vendors' || location.pathname === '/dashboard/purchase' ? 'active' : ''}`}
          >
            Vendors
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard/purchase/expense"
            className={`block p-2 ${location.pathname === '/dashboard/purchase/expense' ? 'active' : ''}`}
          >
            Expenses
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard/purchase/order"
            className={`block p-2 ${location.pathname === '/dashboard/purchase/order' ? 'active' : ''}`}
          >
            Order
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard/purchase/bill"
            className={`block p-2 ${location.pathname === '/dashboard/purchase/bill' ? 'active' : ''}`}
          >
            Bills
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SidePanel;
