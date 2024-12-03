import express from 'express';
import { drizzle } from 'drizzle-orm/postgres-js';
import { PurchaseOrder } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const router = express.Router();

const client = postgres(process.env.DATABASE_URL);
const db3 = drizzle(client, { schema: { PurchaseOrder }, logger: true });

router.post('/', async (req, res) => {
  const {
    name,
    delivery,
    orderno,
    ref,
    date,
    deliverydate,
    terms,
    modeofshipment,
    itemdetails,
    gst,
    total,
    loggedUser
  } = req.body;

  try {
    const [newOrder] = await db3
      .insert(PurchaseOrder) // Replace with your actual PurchaseOrders model
      .values({
        name,
        delivery,
        orderno,
        ref,
        date,
        deliverydate,
        terms,
        modeofshipment,
        itemdetails: JSON.stringify(itemdetails), // Convert to JSON if necessary
        gst: Number(gst),
        total: Number(total),
        loggedUser
      })
      .returning();

    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error adding purchase order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/', async (req, res) => {
  const { loggedUser } = req.query
  try {
    const orders = await db3.select().from(PurchaseOrder).where(eq(PurchaseOrder.loggedUser,loggedUser));
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/', async (req, res) => {
  const { ids } = req.body;
  try {
    for (const id of ids) {
      await db3.delete(PurchaseOrder).where(eq(PurchaseOrder.sno, id));
    }
    res.status(200).json({ message: 'order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})


export default router;