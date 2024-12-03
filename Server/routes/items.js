// items.js

import express from 'express';
import { drizzle } from 'drizzle-orm/postgres-js';
import { Items } from '../drizzle/schema.js';
import { eq, sql } from 'drizzle-orm';
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
    itemCode,
    hsnCode,
    sellingPrice,
    costPrice,
    salesAccount,
    purchaseAccount,
    descriptionSales,
    descriptionPurchase,
    taxPayable,
    gst,
    type,
    quantity,
    openingStock,
    loggedUser
  } = req.body;

  try {
    const [newItem] = await db3
      .insert(Items)
      .values({
        name,
        unit,
        itemcode: itemCode,
        hsncode: hsnCode,
        salesprice: Number(sellingPrice),
        costprice: Number(costPrice),
        salesaccount: salesAccount,
        purchaseaccount: purchaseAccount,
        salesdescription: descriptionSales,
        purchasedescription: descriptionPurchase,
        taxpayable: taxPayable,
        gst: Number(gst),
        type,
        quantity: Number(quantity),
        openingstock: Number(openingStock),
        loggedUser

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
  const {loggedUser} = req.query
  try {
    const items = await db3
      .select({
        sno: Items.sno,
        name: Items.name,
        itemcode: Items.itemcode,
        hsncode: Items.hsncode,
        salesprice: Items.salesprice,
        costprice: Items.costprice,
        type: Items.type,
        unit: Items.unit,
        salesdescription: Items.salesdescription,
        purchasedescription: Items.purchasedescription,
        taxpayable: Items.taxpayable,
        gst: Items.gst,
        quantity: Items.quantity,
        openingstock: Items.openingstock,
        loggedUser:Items.loggedUser
      })
      .from(Items).where(eq(Items.loggedUser,loggedUser));

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

// Reduce item quantity based on HSN code
router.post('/reduce-quantity', async (req, res) => {
  const { hsnCode, orderQuantity } = req.body;

  try {
    // Fetch the item with the matching HSN code
    const [item] = await db3.select().from(Items).where(eq(Items.hsncode, hsnCode));

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Check if there’s enough quantity
    if (item.quantity < orderQuantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Update the quantity
    await db3
      .update(Items)
      .set({ quantity: sql`${Items.quantity} - ${orderQuantity}` })
      .where(eq(Items.hsncode, hsnCode));

    res.status(200).json({ message: 'Quantity reduced successfully' });
  } catch (error) {
    console.error('Error reducing item quantity:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
