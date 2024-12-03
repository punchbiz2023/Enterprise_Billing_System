import express from 'express';
import { drizzle } from 'drizzle-orm/postgres-js';
import { BillForm } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const router = express.Router();

const client = postgres(process.env.DATABASE_URL);
const db3 = drizzle(client, { schema: { BillForm }, logger: true });



router.get('/', async (req, res) => {
    const {loggedUser} = req.query
    try {
      const orders = await db3.select().from(BillForm).where(eq(BillForm.loggedUser,loggedUser));
      res.json(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

router.post('/', async (req, res) => {
    const {
        name,
        billnumber,
        orderno,
        billdate,
        duedate,
        terms,
        modeofshipment,
        itemdetails,
        gst,
        total,
        loggedUser
    } = req.body;

    try {
        const [newBill] = await db3
            .insert(BillForm) // Replace with your actual PurchaseOrders model
            .values({
                name,
                billnumber,
                orderno,
                billdate,
                duedate,
                terms,
                modeofshipment,
                itemdetails: JSON.stringify(itemdetails), // Convert to JSON if necessary
                gst: Number(gst),
                total: Number(total),
                loggedUser
            })
            .returning();

        res.status(201).json(newBill);
    } catch (error) {
        console.error('Error adding bill:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

  
router.delete('/',async(req,res)=>{
    const { ids } = req.body;
  try {
    for (const id of ids) {
      await db3.delete(BillForm).where(eq(BillForm.sno, id));
    }
    res.status(200).json({ message: 'bill deleted successfully' });
  } catch (error) {
    console.error('Error deleting bill:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})


export default router;