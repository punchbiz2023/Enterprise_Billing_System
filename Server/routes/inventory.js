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
  const {loggedUser} = req.query
  try {
    const items = await db.select().from(InventoryTable).where(eq(InventoryTable.loggedUser,loggedUser));
    res.json(items);
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST new inventory item
// POST new inventory item
router.post('/', async (req, res) => {
  const {
    itemName,
    itemCode,
    hsnCode,
    quantity,
    rate,
    gst,
    loggedUser
  } = req.body;

  try {
    const parsedGst = gst === "0.00" || gst === "" ? 0 : parseFloat(gst);
    
    const [newItem] = await db
      .insert(InventoryTable)
      .values({
        itemName: itemName,
        itemCode: itemCode,
        hsnCode: hsnCode,
        quantity: parseInt(quantity),
        rate: parseFloat(rate),
        gst: parsedGst,
        loggedUser
      })
      .returning();
      
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error adding inventory item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Inventory update route
router.post('/update', async (req, res) => {
  const { items } = req.body; // Expecting an array of items with id and reduced quantity

  try {
    // Loop through each item and update its quantity
    for (const item of items) {
      await db.update(InventoryTable)
        .set({ quantity: item.quantity }) // Set the new quantity
        .where(eq(InventoryTable.id, item.id)); // Find by id
    }
    res.status(200).json({ message: 'Inventory updated successfully' });
  } catch (error) {
    console.error('Error updating inventory:', error); // Log the error
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
