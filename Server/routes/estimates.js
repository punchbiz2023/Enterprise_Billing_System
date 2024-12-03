import express from 'express';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';

import { Estimate } from '../drizzle/schema.js';
import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const router = express.Router();

const client = postgres(process.env.DATABASE_URL);
const db5 = drizzle(client, { schema: { Estimate }, logger: true });


router.get('/', async (req, res) => {
  const { loggedUser } = req.query
  try {
    const Estimates = await db5.select().from(Estimate).where(eq(Estimate.loggedUser, loggedUser));
    res.json(Estimates);
  } catch (error) {
    console.error('Error fetching Estimates:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Add a new estimate
router.post('/', async (req, res) => {
  try {
    const { customer, quoteNumber, reference, quoteDate, expiryDate, salesperson, projectName, subject, items, taxtype, taxrate, total, loggedUser } = req.body;

    // Validate input
    if (!customer || !quoteNumber || !quoteDate || !expiryDate || !salesperson || !projectName || !items || !total || !loggedUser) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    // Insert into the database
    await db5.insert(Estimate).values({
      cname: customer,
      quotenum: quoteNumber,
      refnum: reference || null,
      qdate: quoteDate,
      expdate: expiryDate,
      salesperson: salesperson,
      project: projectName,
      subject: subject || null,
      itemtable: items, // items should be passed as an array or object
      taxtype: taxtype, // passed as text
      taxrate: taxrate, // passed as text or number
      total: total,
      loggedUser
    });

    res.status(201).json({ message: 'Estimate added successfully' });
  } catch (error) {
    console.error('Error adding estimate:', error);
    res.status(500).json({ error: 'An error occurred while adding the estimate' });
  }
});


router.delete('/', async (req, res) => {
  const { ids } = req.body;
  try {
    for (const id of ids) {
      await db5.delete(Estimate).where(eq(Estimate.sno, id));
    }
    res.status(200).json({ message: 'Estimate deleted successfully' });
  } catch (error) {
    console.error('Error deleting Estimate:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

export default router;
