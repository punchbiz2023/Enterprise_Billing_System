import express from 'express';
import { drizzle } from 'drizzle-orm/postgres-js';
import { SalesOrder } from '../drizzle/schema.js';
import postgres from 'postgres';
import dotenv from 'dotenv';
import { eq } from 'drizzle-orm';

dotenv.config({ path: './.env' });

const router = express.Router();

const client = postgres(process.env.DATABASE_URL);
const db3 = drizzle(client, { schema: { SalesOrder }, logger: true });

router.post('/', async (req, res) => {
  const {
    name,
    state,
    caddress,
    contact,
    mail,
    invoiceid,
    orderno,
    orderdate,
    shipmentdate,
    invoicedate,
    duedate,
    terms,
    itemdetails,
    subject,
    salesperson,
    taxtype,
    taxrate,
    total,
    loggedUser
  } = req.body;

  try {
    const [newOrder] = await db3
      .insert(SalesOrder)
      .values({
        name,
        state,
        caddress,
        contact,
        mail,
        invoiceid,
        orderno,
        orderdate,
        shipmentdate,
        invoicedate,
        duedate,
        terms,
        itemdetails: JSON.stringify(itemdetails), // Convert item details to JSON
        subject,
        salesperson,
        taxtype,
        taxrate,
        total: Number(total),
        loggedUser
      })
      .returning();

    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error creating sales order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/', async (req, res) => {
  const { loggedUser } = req.query
  try {
    const orders = await db3.select().from(SalesOrder);
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
      await db3.delete(SalesOrder).where(eq(SalesOrder.sno, id));
    }
    res.status(200).json({ message: 'order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})


export default router;
