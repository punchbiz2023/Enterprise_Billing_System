import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './sidepanel.css' // Import the CSS file

const SidePanel = () => {
  const location = useLocation();

  return (
    <div className="side-panel">
      <ul>
        <li>
        <Link
            to="/dashboard/inventory/items"
            className={`side-link ${location.pathname === '/dashboard/inventory/items' || location.pathname === '/dashboard/inventory' ? 'active' : ''}`}
          >
            Manage Items
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SidePanel;
