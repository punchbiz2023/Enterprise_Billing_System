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
import Purchase from './components/Purchase/Purchase.jsx';
import Vendor from './components/Vendor/Vendor.jsx'
import VendorForm from './components/Vendor/VendorForm.jsx'
import Order from './components/Order/Order.jsx';
import Estimate from './components/Estimate/Estimate.jsx';
import ItemForm from './components/Items/ItemForm.jsx';
import ExpenseForm from './components/Expenses/expenses.jsx';

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
        <Route path="/dashboard/items/form" element={<ItemForm />} />
        <Route path="/dashboard/sales" element={<Customer />} />
        <Route path="/dashboard/purchase" element={<Vendor />} />
        <Route path="/dashboard/sales/customers" element={<Customer/>} />
        <Route path="/dashboard/sales/customers/form" element={<CustomerForm/>} />
        <Route path='/dashboard/purchase/vendors' element={<Vendor/>} />
        <Route path='/dashboard/purchase/vendors/form' element={<VendorForm/>} />
        <Route path='/dashboard/sales/order' element={<Order/>} />
        <Route path='/dashboard/purchase/expense'element={<ExpenseForm/>} />
       
        <Route path='/dashboard/sales/estimate' element={<Estimate />} />
      </Routes>
    </Router> 
  );
}

export default App;
