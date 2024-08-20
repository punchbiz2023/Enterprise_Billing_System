import React from 'react';
import Navbar from '../Navbar/Navbar'; // Import the Navbar component
import './sales.css'; // Optional: Add CSS for styling the Sales page

const Sales = () => {
  return (
    <div className="sales-container">
      <Navbar />
      <div className="sales-content">
        <h1>Sales Page</h1>
        {/* Add your sales content here */}
      </div>
    </div>
  );
};

export default Sales;
