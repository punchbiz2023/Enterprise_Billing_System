// customers.js
import express from 'express';
import { eq } from 'drizzle-orm';
import { CustTable } from '../drizzle/schema.js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const router = express.Router();
const client = postgres(process.env.DATABASE_URL);
const db = drizzle(client, { schema: { CustTable }, logger: true });

// GET customers
router.get('/', async (req, res) => {
  const {loggedUser} = req.query
  try {
    const customers = await db.select().from(CustTable).where(eq(CustTable.loggedUser,loggedUser));
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST new customer
router.post('/', async (req, res) => {
  
  // console.log(req);
  const {
    customerType,
    name,
    company,
    dispname,
    mail,
    workphone,
    mobilephone,
    panno,
    gstno,
    currency,
    openingbalance,
    paymentterms,
    billaddress,
    shipaddress,
    loggedUser,
  } = req.body;
  
  // console.log(req.body);
  
  try {
    const openingBalanceNumber = parseFloat(openingbalance);

    const [newCustomer] = await db
      .insert(CustTable)
      .values({
        type: customerType,
        name,
        company,
        dispname,
        mail,
        workphone,
        mobilephone,
        panno,
        gstno,
        currency,
        openingbalance: openingBalanceNumber,
        paymentterms,
        billaddress,
        shipaddress,
        loggedUser,
      })
      .returning();

    res.status(201).json(newCustomer);
  } catch (error) {
    console.error('Error adding customer:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE customers
router.delete('/', async (req, res) => {
  const { ids } = req.body;

  try {
    for (const id of ids) {
      await db.delete(CustTable).where(eq(CustTable.sno, id));
    }
    res.status(200).json({ message: 'Customers deleted successfully' });
  } catch (error) {
    console.error('Error deleting customers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
