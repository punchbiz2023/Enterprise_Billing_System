import express from 'express';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { CustTable, VendTable, Items} from './drizzle/schema.js';
import { eq } from 'drizzle-orm';

import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const app = express();
app.use(express.json());

import cors from 'cors';
app.use(cors());

const client = postgres(process.env.DATABASE_URL);
const db = drizzle(client, { schema: { CustTable }, logger: true });
const db2 = drizzle(client, { schema: { VendTable }, logger: true });
const db3 = drizzle(client, { schema: { Items }, logger: true });


app.get('/api/customers', async (req, res) => {
  try {
    const customers = await db
      .select({
        sno: CustTable.sno,
        name: CustTable.name,
        company: CustTable.company,
        email: CustTable.mail,
        gstno: CustTable.gstno,
        phone: CustTable.phone,
        amount: CustTable.amountToBeReceived,
      })
      .from(CustTable);

    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/customers', async (req, res) => {
  const { name, company, email, gstno, phone, amountToBeReceived } = req.body;
  try {
    const [newCustomer] = await db
      .insert(CustTable)
      .values({
        name,
        company,
        mail: email,
        gstno,
        phone,
        amountToBeReceived: Number(amountToBeReceived),
      })
      .returning();

    res.status(201).json(newCustomer);
  } catch (error) {
    console.error('Error adding customer:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/customers', async (req, res) => {
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


//vendor



app.get('/api/vendor', async (req, res) => {
  try {
    const vendors = await db2
      .select({
        sno: VendTable.sno,
        name: VendTable.name,
        company: VendTable.company,
        email: VendTable.mail,
        gstno: VendTable.gstno,
        phone: VendTable.phone,
        amount: VendTable.amountToBeReceived,
      })
      .from(VendTable);

    res.json(vendors);
  } catch (error) {
    console.error('Error fetching vendors:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/vendor', async (req, res) => {
  const { name, company, email, gstno, phone, amountToBeReceived } = req.body;
  try {
    const [newVendor] = await db2
      .insert(VendTable)
      .values({
        name,
        company,
        mail: email,
        gstno,
        phone,
        amountToBeReceived: Number(amountToBeReceived),
      })
      .returning();

    res.status(201).json(newVendor);
  } catch (error) {
    console.error('Error adding vendor:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/vendor', async (req, res) => {
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


//Items

app.post('/api/items', async (req, res) => {
  const { name, rate, type, unit, description } = req.body;  
  try {
    const [newItem] = await db3
      .insert(Items)
      .values({
        name,
        rate: Number(rate),
        type, 
        unit,
        description,
      })
      .returning();

    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/api/items', async (req, res) => {
  try {
    const items = await db3
      .select({
        sno: Items.sno,
        name: Items.name,
        rate: Items.rate,
        type: Items.type,
        unit: Items.unit,
        description: Items.description,
      })
      .from(Items);

    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.delete('/api/items', async (req, res) => {
  const { ids } = req.body;
  try {
    for (const id of ids) {
      await db3.delete(Items).where(eq(Items.sno, id));
    }
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting Item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
