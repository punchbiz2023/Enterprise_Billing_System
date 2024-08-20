import React from 'react';
import Navbar from '../Navbar/Navbar'; // Import the Navbar component
import './dashboard.css'; // CSS for the Dashboard layout

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        {/* Content of the dashboard will be rendered here */}
      </div>
    </div>
  );
};

export default Dashboard;
