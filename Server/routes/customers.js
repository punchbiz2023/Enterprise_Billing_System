import express from 'express';
import { drizzle } from 'drizzle-orm/postgres-js';
import { CustTable } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';

const router = express.Router();
const client = postgres(process.env.DATABASE_URL);
const db = drizzle(client, { schema: { CustTable }, logger: true });

router.get('/', async (req, res) => {
  try {
    const customers = await db.select().from(CustTable);
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/', async (req, res) => {
  const { customerType, name, company, dispname, mail, workphone, mobilephone, panno, gstno, currency, openingbalance, paymentterms, billaddress, shipaddress } = req.body;
  try {
    const openingBalanceNumber = parseFloat(openingbalance);
    const [newCustomer] = await db
      .insert(CustTable)
      .values({
        type: customerType,
        name,
        company,
        dispname,
        mail,
        workphone,
        mobilephone,
        panno,
        gstno,
        currency,
        openingbalance: openingBalanceNumber,
        paymentterms,
        billaddress,
        shipaddress
      })
      .returning();
    res.status(201).json(newCustomer);
  } catch (error) {
    console.error('Error adding customer:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/', async (req, res) => {
  const { ids } = req.body;
  try {
    for (const id of ids) {
      await db.delete(CustTable).where(eq(CustTable.sno, id));
    }
    res.status(200).json({ message: 'Customers deleted successfully' });
  } catch (error) {
    console.error('Error deleting customers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
