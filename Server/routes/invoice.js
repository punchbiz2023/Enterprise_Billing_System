import express from 'express';
import { eq } from 'drizzle-orm';
import { Invoice } from '../drizzle/schema.js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const router = express.Router();
const client = postgres(process.env.DATABASE_URL);
const db = drizzle(client, { schema: { Invoice }, logger: true });


router.get('/', async (req, res) => {
  const {loggedUser} = req.query
  try {
    const invoice = await db.select().from(Invoice).where(eq(Invoice.loggedUser,loggedUser));
    res.json(invoice);
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/', async (req, res) => {
  const {
    name,
    state,
    phone,
    mail,
    invoiceid,
    invdate,
    duedate,
    terms,
    subject,
    salesperson,
    taxtype,
    taxrate,
    amount,
    loggedUser
  } = req.body;


  try {

    const result = await db.insert(Invoice).values({
      name,
      state,
      phone,
      mail,
      invoiceid,
      invdate,
      duedate,
      terms,
      subject,
      salesperson,
      taxtype,
      taxrate,
      amount,
      loggedUser
    });


    res.status(201).json({ message: 'Invoice created successfully', result });
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});

router.delete('/', async (req, res) => {
  const { ids } = req.body;

  try {
    for (const id of ids) {
      await db.delete(Invoice).where(eq(Invoice.sno, id));
    }
    res.status(200).json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error('Error deleting Invoice:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


export default router;