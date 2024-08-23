import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login/Login.jsx';
import SignUp from './components/login/Signup.jsx';
import Dashboard from './components/dashboard/dashboard.jsx';
import Items from './components/Items/Items.jsx'; 
import Sales from './components/Sales/Sales.jsx'; 
import Header from './components/Header/Header.jsx';
import Navbar from './components/Navbar/Navbar.jsx';
import Customer from './components/Customer/Customer.jsx'
import CustomerForm from './components/Customer/CustomerForm.jsx'

function App() {
  return (
    <Router>
      <Header />
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/items" element={<Items />} />
        <Route path="/dashboard/sales" element={<Sales />} />
        <Route path="/dashboard/sales/customers" element={<Customer/>} />
        <Route path="/dashboard/sales/customers/form" element={<CustomerForm/>} />

      </Routes>
    </Router>
  );
}

export default App;
