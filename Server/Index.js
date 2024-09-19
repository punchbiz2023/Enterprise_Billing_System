import express from 'express';
import cust from './routes/customers.js';
import vend from './routes/vendors.js'
import item from './routes/items.js'
import users from './routes/users.js'
import estimates from './routes/estimates.js'
import salesperson from './routes/salesperson.js';
import purchaseOrder from './routes/purchaseorder.js'

import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const app = express();
app.use(express.json());

import cors from 'cors';
app.use(cors());

app.use('/api/customers',cust);
app.use('/api/vendor',vend);
app.use('/api/items',item)
app.use('/api/sign-up',users)
app.use('/api/estimates',estimates)
app.use('/api/salespersons',salesperson)
app.use('/api/purchaseorder',purchaseOrder)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
