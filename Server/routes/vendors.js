import express from 'express';
import { drizzle } from 'drizzle-orm/postgres-js';
import { VendTable } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';

const router = express.Router();
const client = postgres(process.env.DATABASE_URL);
const db2 = drizzle(client, { schema: { VendTable }, logger: true });

router.get('/', async (req, res) => {
  try {
    const vendors = await db2.select().from(VendTable);
    res.json(vendors);
  } catch (error) {
    console.error('Error fetching vendors:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/', async (req, res) => {
  const { name, company, dispname, mail, workphone, mobilephone, panno, gstno, currency, openingbalance, paymentterms, billaddress, shipaddress } = req.body;
  try {
    const openingBalanceNumber = parseFloat(openingbalance);
    const [newVendor] = await db2
      .insert(VendTable)
      .values({
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
    res.status(201).json(newVendor);
  } catch (error) {
    console.error('Error adding vendor:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/', async (req, res) => {
  const { ids } = req.body;
  try {
    for (const id of ids) {
      await db2.delete(VendTable).where(eq(VendTable.sno, id));
    }
    res.status(200).json({ message: 'Vendors deleted successfully' });
  } catch (error) {
    console.error('Error deleting vendors:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
