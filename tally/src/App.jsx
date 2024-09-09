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
import PurchaseOrder from './components/PurchaseOrder/PurchaseOrder.jsx';
import Project from './components/Project/Project.jsx';

// Layout with Header and Navbar
function MainLayout({ children }) {
  return (
    <>
      <Header />
      <Navbar />
      <div>{children}</div>
    </>
  );
}

// Layout without Header and Navbar
function AuthLayout({ children }) {
  return <div>{children}</div>;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes without Header and Navbar */}
        <Route path="/" element={<AuthLayout><Login /></AuthLayout>} />
        <Route path="/sign-up" element={<AuthLayout><SignUp /></AuthLayout>} />

        {/* Routes with Header and Navbar */}
        <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
        <Route path="/dashboard/items" element={<MainLayout><Items /></MainLayout>} />
        <Route path="/dashboard/items/form" element={<MainLayout><ItemForm /></MainLayout>} />
        <Route path="/dashboard/sales" element={<MainLayout><Customer /></MainLayout>} />
        <Route path="/dashboard/purchase" element={<MainLayout><Vendor /></MainLayout>} />
        <Route path="/dashboard/sales/customers" element={<MainLayout><Customer /></MainLayout>} />
        <Route path="/dashboard/sales/customers/form" element={<MainLayout><CustomerForm /></MainLayout>} />
        <Route path="/dashboard/purchase/vendors" element={<MainLayout><Vendor /></MainLayout>} />
        <Route path="/dashboard/purchase/vendors/form" element={<MainLayout><VendorForm /></MainLayout>} />
        <Route path="/dashboard/sales/order" element={<MainLayout><Order /></MainLayout>} />
        <Route path="/dashboard/purchase/expense" element={<MainLayout><ExpenseForm /></MainLayout>} />
        <Route path="/dashboard/sales/estimate" element={<MainLayout><Estimate /></MainLayout>} />
        <Route path="/dashboard/projects/form" element={<MainLayout><Project /></MainLayout>} />
        <Route path="/dashboard/purchase/order" element={<MainLayout><PurchaseOrder /></MainLayout>} />
      </Routes>
    </Router>
  );
}

export default App;

