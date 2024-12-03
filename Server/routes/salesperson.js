import express from 'express';
import { eq } from 'drizzle-orm';
import { SalesPerson } from '../drizzle/schema.js'; // Ensure this import is correct
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const router = express.Router();
const client = postgres(process.env.DATABASE_URL);
const db = drizzle(client, { schema: { SalesPerson }, logger: true });

// Get all salespersons
router.get('/', async (req, res) => {
  const {loggedUser} = req.query
  try {
    const salespersons = await db.select().from(SalesPerson).where(eq(SalesPerson.loggedUser,loggedUser));
    res.json(salespersons);
  } catch (error) {
    console.error('Error fetching salespersons:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new salesperson
router.post('/', async (req, res) => {
  const { name, email,loggedUser } = req.body;
  console.log('Request body:', req.body); // Log request payload for debugging
  try {
    const newSalesPerson = await db.insert(SalesPerson).values({ name, mail:email }).where(eq(SalesPerson.loggedUser,loggedUser));
    res.status(201).json(newSalesPerson);
  } catch (error) {
    console.error('Error creating salesperson:', error);
    res.status(400).json({ error: 'Bad request' });
  }
});

// Delete a salesperson by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.delete(SalesPerson).where(eq(SalesPerson.id, id));
    if (result.count > 0) {
      res.status(204).send(); // No content
    } else {
      res.status(404).json({ error: 'Salesperson not found' });
    }
  } catch (error) {
    console.error('Error deleting salesperson:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
