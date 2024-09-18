import express from 'express';
import { drizzle } from 'drizzle-orm/postgres-js';
import { Items } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const router = express.Router();

const client = postgres(process.env.DATABASE_URL);
const db3 = drizzle(client, { schema: { Items }, logger: true });

// Add new item
router.post('/', async (req, res) => {
  const {
    name,
    unit,
    sellingPrice,
    costPrice,
    salesAccount,
    purchaseAccount,
    descriptionSales,
    descriptionPurchase,
    preferredVendor,
    type
  } = req.body;

  try {
    const [newItem] = await db3
      .insert(Items)
      .values({
        name,
        unit,
        salesprice: Number(sellingPrice),
        costprice: Number(costPrice),
        salesaccount: salesAccount,
        purchaseaccount: purchaseAccount,
        salesdescription: descriptionSales,
        purchasedescription: descriptionPurchase,
        type,
      })
      .returning();

    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all items
router.get('/', async (req, res) => {
  try {
    const items = await db3
      .select({
        sno: Items.sno,
        name: Items.name,
        salesprice: Items.salesprice,
        costprice: Items.costprice,
        type: Items.type,
        unit: Items.unit,
        salesdescription: Items.salesdescription,
        purchasedescription: Items.purchasedescription,
      })
      .from(Items);

    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error.message, error.stack);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// Delete items by ID
router.delete('/', async (req, res) => {
  const { ids } = req.body;
  try {
    for (const id of ids) {
      await db3.delete(Items).where(eq(Items.sno, id));
    }
    res.status(200).json({ message: 'Items deleted successfully' });
  } catch (error) {
    console.error('Error deleting items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
