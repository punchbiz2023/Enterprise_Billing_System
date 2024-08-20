import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login/Login.jsx';
import SignUp from './components/login/Signup.jsx';
import Dashboard from './components/dashboard/dashboard.jsx';
import Items from './components/Items/Items.jsx'; // Import the Items component
import Sales from './components/Sales/Sales.jsx'; //

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/items" element={<Items />} />
        <Route path="/dashboard/sales" element={<Sales />} />  
        {/* Add routes for other pages as needed */}
      </Routes>
    </Router>
  );
}

export default App;
