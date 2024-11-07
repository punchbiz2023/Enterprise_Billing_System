import React from 'react';
import Navbar from '../Navbar/Navbar';
import SidePanel from '../Sales/Sidepanel.jsx';
import './Sales.css';

const Sales = () => {
  return (
    <div className="sales-container">
      
      <SidePanel />
      <div className="sales-content">
        <h1>Sales Page</h1>
        
      </div>
    </div>
  );
};

export default Sales;
