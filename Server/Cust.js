import express from 'express';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { CustTable } from "./drizzle/schema.js";
import { eq } from 'drizzle-orm';

import dotenv from 'dotenv';
dotenv.config({ path: "./.env" });

const app = express();
app.use(express.json());

import cors from 'cors';
app.use(cors());

const client = postgres(process.env.DATABASE_URL);
const db = drizzle(client, { schema: { CustTable }, logger: true });

app.get('/api/customers', async (req, res) => {
  try {
    const customers = await db.select({
      sno: CustTable.sno,
      name: CustTable.name,
      company: CustTable.company,
      email: CustTable.mail,
      gstno: CustTable.gstno,
      phone: CustTable.phone,
      amount: CustTable.amountToBeReceived
    }).from(CustTable);

    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/api/customers', async (req, res) => {
  const { name, company, email, gstno, phone, amountToBeReceived } = req.body;
  try {
    const [newCustomer] = await db.insert(CustTable).values({
      
      name,
      company,
      mail: email,
      gstno,
      phone,
      amountToBeReceived: Number(amountToBeReceived),
    }).returning(); 

    res.status(201).json(newCustomer);
  } catch (error) {
    console.error('Error adding customer:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.delete('/api/customers', async (req, res) => {
  const { ids } = req.body; // Expecting an array of customer IDs to delete

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



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
