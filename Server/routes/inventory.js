// inventory.js
import express from 'express';
import { eq } from 'drizzle-orm';
import { InventoryTable } from '../drizzle/schema.js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const router = express.Router();
const client = postgres(process.env.DATABASE_URL);
const db = drizzle(client, { schema: { InventoryTable }, logger: true });

// GET inventory items
router.get('/', async (req, res) => {
  try {
    const items = await db.select().from(InventoryTable);
    res.json(items);
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST new inventory item
// POST new inventory items (handling an array)
router.post('/', async (req, res) => {
  const items = req.body.items;  // expecting an array of items

  try {
    const newItems = [];

    for (const item of items) {
      const { itemName, hsnCode, quantity, rate, gst } = item;

      const [newItem] = await db
        .insert(InventoryTable)
        .values({
          itemName: itemName,
          hsnCode: hsnCode,
          quantity: parseInt(quantity),
          rate: parseFloat(rate),
          gst: parseFloat(gst),
        })
        .returning();

      newItems.push(newItem);
    }

    res.status(201).json(newItems);
  } catch (error) {
    console.error('Error adding inventory item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// DELETE inventory items
router.delete('/', async (req, res) => {
  const { ids } = req.body;

  try {
    for (const id of ids) {
      await db.delete(InventoryTable).where(eq(InventoryTable.id, id));
    }
    res.status(200).json({ message: 'Items deleted successfully' });
  } catch (error) {
    console.error('Error deleting items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
