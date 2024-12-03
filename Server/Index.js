import express from 'express';
import cust from './routes/customers.js';
import vend from './routes/vendors.js'
import item from './routes/items.js'
import users from './routes/users.js'
import salesperson from './routes/salesperson.js';
import purchaseOrder from './routes/purchaseorder.js'
import BillForm from './routes/bills.js'
import Invoice from './routes/invoice.js'
import Project from './routes/projects.js'
import Estimates from './routes/estimates.js'
import  SalesOrder  from './routes/salesOrder.js';
import inventory from './routes/inventory.js';
import CreditNotes from './routes/creditNotes.js';
import Login from './routes/login.js';

import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const app = express();
app.use(express.json());

import cors from 'cors';
app.use(cors());

// app.use((req, res, next) => {
//   console.log('Incoming Request:', req.method, req.url);
//   console.log('Request Body:', req.body);
//   next();
// });


app.use('/api/customers',cust);
app.use('/api/vendor',vend);
app.use('/api/items',item)
app.use('/api/sign-up',users)
app.use('/api/salespersons',salesperson)
app.use('/api/purchaseorder',purchaseOrder)
app.use('/api/bill',BillForm)
app.use('/api/invoice',Invoice)
app.use('/api/projects',Project)
app.use('/api/estimates',Estimates)
app.use('/api/salesorder',SalesOrder)
app.use('/api/inventory',inventory)
app.use('/api/creditnote',CreditNotes)
app.use('/api/login',Login)


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
