import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login/login.jsx';
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
import ItemDetails from './components/Items/ItemDetails.jsx';
import BillForm from './components/Bills/BillForm.jsx';
import InvoiceForm from './components/Invoice/invoiceForm.jsx';
import VendorDetails from './components/Vendor/VendorDetails.jsx';
import CustomerDetails from './components/Customer/CustomerDetails.jsx';
import Delivery from './components/DeliveryChallan/Delivery.jsx';
import SalesPerson from './components/Salesperson/SalesPerson.jsx';
import PurchaseOrderTable from './components/PurchaseOrder/PurchaseOrderTable.jsx';
import Invoice from './components/Invoice/Invoice.jsx';
import Bill from './components/Bills/Bill.jsx';
import EstimateTable from './components/Estimate/EstimateTable.jsx';
import EstimateDetails from './components/Estimate/EstimateDetails.jsx';
import InvoiceDetails from './components/Invoice/InvoiceDetails.jsx';
import OrderTable from './components/Order/OrderTable.jsx';
import OrderDetails from './components/Order/OrderDetails.jsx';
import BillDetails from './components/Bills/BillDetails.jsx';
import PurchaseOrderDetails from './components/PurchaseOrder/PurchaseOrderDetails.jsx';
import Reports from './components/Reports/Reports.jsx';
import CreditNotes from './components/CreditNotes/creditForm.jsx';
import Inventory from './components/Inventory/inventory.jsx';
import CreditTable from './components/CreditNotes/CreditTable.jsx';
import CreditDetails from './components/CreditNotes/CreditDetails.jsx';
import Journal from './components/Journal/Journal.jsx';
function MainLayout({ children }) {
  return (
    <>
      <Header />
      <Navbar />
      <div>{children}</div>
    </>
  );
}
function AuthLayout({ children }) {
  return <div>{children}</div>;
}
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthLayout><Login /></AuthLayout>} />
        <Route path="/sign-up" element={<AuthLayout><SignUp /></AuthLayout>} />
        <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
        <Route path="/dashboard/items" element={<MainLayout><Items /></MainLayout>} />
        <Route path="/dashboard/items/form" element={<MainLayout><ItemForm /></MainLayout>} />
        <Route path="/dashboard/sales" element={<MainLayout><Customer /></MainLayout>} />
        <Route path="/dashboard/purchase" element={<MainLayout><Vendor /></MainLayout>} />
        <Route path="/dashboard/sales/customers" element={<MainLayout><Customer /></MainLayout>} />
        <Route path="/dashboard/sales/customers/form" element={<MainLayout><CustomerForm /></MainLayout>} />
        <Route path="/dashboard/purchase/vendors" element={<MainLayout><Vendor /></MainLayout>} />
        <Route path="/dashboard/purchase/vendors/form" element={<MainLayout><VendorForm /></MainLayout>} />
        <Route path="/dashboard/sales/order/form" element={<MainLayout><Order /></MainLayout>} />
        <Route path="/dashboard/sales/order/:id" element={<MainLayout><OrderDetails /></MainLayout>} />
        <Route path="/dashboard/sales/order" element={<MainLayout><OrderTable /></MainLayout>} />
        <Route path="/dashboard/purchase/expense" element={<MainLayout><ExpenseForm /></MainLayout>} />
        <Route path="/dashboard/sales/estimate/form" element={<MainLayout><Estimate /></MainLayout>} />
        <Route path="/dashboard/sales/estimate" element={<MainLayout><EstimateTable /></MainLayout>} />
        <Route path="/dashboard/sales/estimate/:id" element={<MainLayout><EstimateDetails /></MainLayout>} />
        <Route path="/dashboard/projects/form" element={<MainLayout><Project /></MainLayout>} />
        <Route path="/dashboard/purchase/order/form" element={<MainLayout><PurchaseOrder /></MainLayout>} />
        <Route path="/dashboard/purchase/order/:id" element={<MainLayout><PurchaseOrderDetails /></MainLayout>} />
        <Route path="/dashboard/items/:id" element={<MainLayout><ItemDetails /></MainLayout>} />
        <Route path="/items/:id" element={<MainLayout><ItemDetails /></MainLayout>} />
        <Route path="/dashboard/purchase/vendors/:id" element={<MainLayout><VendorDetails /></MainLayout>} />
        <Route path="/dashboard/sales/customer/:id" element={<MainLayout><CustomerDetails /></MainLayout>} />
        <Route path="/dashboard/purchase/bill/form" element={<MainLayout><BillForm /></MainLayout>} />
        <Route path="/dashboard/sales/invoice/form" element={<MainLayout><InvoiceForm /></MainLayout>} />
        <Route path="/dashboard/sales/delivery" element={<MainLayout><Delivery /></MainLayout>} />
        <Route path="/dashboard/salesperson" element={<MainLayout><SalesPerson /></MainLayout>} />
        <Route path="/dashboard/purchase/order" element={<MainLayout><PurchaseOrderTable/></MainLayout>} />
        <Route path='/dashboard/sales/invoice' element={<MainLayout><Invoice/></MainLayout>}/>
        <Route path='/dashboard/sales/invoice/:id' element={<MainLayout><InvoiceDetails/></MainLayout>}/>
        <Route path='/dashboard/purchase/bill' element={<MainLayout><Bill/></MainLayout>}/>
        <Route path='/dashboard/purchase/bill/:id' element={<MainLayout><BillDetails/></MainLayout>}/>
        <Route path='/dashboard/sales/credit/:id' element={<MainLayout><CreditDetails/></MainLayout>}/>
        <Route path='/dashboard/sales/credit/form' element={<MainLayout><CreditNotes/></MainLayout>}/>
        <Route path='/dashboard/sales/credit' element={<MainLayout><CreditTable/></MainLayout>}/>
        <Route path='/dashboard/inventory' element={<MainLayout><Inventory/></MainLayout>}/>
        <Route path='/dashboard/journal' element={<MainLayout><Journal/></MainLayout>}/>
        <Route path='/dashboard/report' element={<MainLayout><Reports/></MainLayout>}></Route>
      </Routes>
    </Router>
  );
}
export default App;