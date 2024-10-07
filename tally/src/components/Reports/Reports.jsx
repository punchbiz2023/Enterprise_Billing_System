import React from 'react';
import Navbar from '../Navbar/Navbar';
import SidePanel from './sidepanel';
import './Reports.css';

const Reports = () => {
  return (
    <div className="reports-container">
      
      <SidePanel />
      <div className="reports-content">
        <h1>Reports Page</h1>
      </div>
    </div>
  );
};

export default Reports;
