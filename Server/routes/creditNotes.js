import express from 'express';
import { eq } from 'drizzle-orm';
import { CreditNote } from '../drizzle/schema.js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const router = express.Router();
const client = postgres(process.env.DATABASE_URL);
const db = drizzle(client, { schema: { CreditNote }, logger: true });


router.get('/', async (req, res) => {
  const {loggedUser} = req.query
  try {
    const notes = await db.select().from(CreditNote).where(eq(CreditNote.loggedUser,loggedUser));
    res.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/', async (req, res) => {

  console.log(req.body);
  
  
  const {
    name,
    creditno,
    refno,
    creditdate,
    itemdetails,
    subject,
    notes,
    terms,
    salesperson,
    taxtype,
    taxrate,
    amount,
    loggedUser
  } = req.body;
  // console.log('Received itemdetails:', itemdetails);



  try {

    const result = await db.insert(CreditNote).values({
        name,
        creditno,
        refno,
        creditdate,
        itemdetails: JSON.stringify(itemdetails),
        subject,
        notes,
        terms,
        salesperson,
        taxtype,
        taxrate,
        amount,
        loggedUser
    });


    res.status(201).json({ message: 'Notes created successfully', result });
  } catch (error) {
    console.error('Error creating Notes:', error);
    res.status(500).json({ error: 'Failed to create Notes' });
  }
});

router.delete('/', async (req, res) => {
  const { ids } = req.body;

  try {
    for (const id of ids) {
      await db.delete(CreditNote).where(eq(CreditNote.sno, id));
    }
    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting Note:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


export default router;