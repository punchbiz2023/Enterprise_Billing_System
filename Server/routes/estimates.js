import express from 'express';
import { drizzle } from 'drizzle-orm/postgres-js';
import { Estimate } from '../drizzle/schema.js';
import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const router = express.Router();

const client = postgres(process.env.DATABASE_URL);
const db5 = drizzle(client, { schema: { Estimate }, logger: true });

// Add a new estimate
router.post('/', async (req, res) => {
  try {
    const { customer, quoteNumber, reference, quoteDate, expiryDate, salesperson, projectName, subject, items, subtotal } = req.body;

    // Validate input
    if (!customer || !quoteNumber || !quoteDate || !expiryDate || !salesperson || !projectName || !items || !subtotal) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    // Insert into the database
    await db5.insert(Estimate).values({
      cname: customer,
      quotenum: quoteNumber,
      refnum: reference,
      qdate: new Date(quoteDate),
      expdate: new Date(expiryDate),
      salesperson: salesperson,
      project: projectName,
      subject: subject || null,
      itemtable: itemtable,
      subtotal: subtotal
    });

    res.status(201).json({ message: 'Estimate added successfully' });
  } catch (error) {
    console.error('Error adding estimate:', error);
    res.status(500).json({ error: 'An error occurred while adding the estimate' });
  }
});

export default router;
