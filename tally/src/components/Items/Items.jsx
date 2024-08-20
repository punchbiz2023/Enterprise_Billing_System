import React from 'react';
import Navbar from '../Navbar/Navbar'; // Import the Navbar component
import './items.css'; // Optional: Add CSS for styling the Items page

const Items = () => {
  return (
    <div className="items-container">
      <Navbar />
      <div className="items-content">
        <h1>Items Page</h1>
        {/* Add your items content here */}
      </div>
    </div>
  );
};

export default Items;
