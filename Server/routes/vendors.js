// routes/vendor.js
import express from 'express';
import { drizzle } from 'drizzle-orm/postgres-js';
import { VendTable } from '../drizzle/schema.js'; // Adjust path if needed
import { eq } from 'drizzle-orm';
import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const router = express.Router();

// Initialize PostgreSQL connection and drizzle ORM
const client = postgres(process.env.DATABASE_URL);
const db2 = drizzle(client, { schema: { VendTable }, logger: true });

router.get('/', async (req, res) => {
  const {loggedUser} =  req.query
  try {
    const vendors = await db2.select().from(VendTable).where(eq(VendTable.loggedUser,loggedUser));
    res.json(vendors);
  } catch (error) {
    console.error('Error fetching vendors:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add a new vendor
router.post('/', async (req, res) => {
  const {
    name,
    company,
    dispname,
    mail,
    workphone,
    mobilephone,
    panno,
    gstno,
    currency,
    openingbalance,
    paymentterms,
    billaddress,
    shipaddress,
    loggedUser
  } = req.body;

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
        shipaddress,
        loggedUser
      })
      .returning();

    res.status(201).json(newVendor);
  } catch (error) {
    console.error('Error adding vendor:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete vendors
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
