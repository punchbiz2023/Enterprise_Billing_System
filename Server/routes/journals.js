// import express from 'express';
// import { Journal } from '../drizzle/schema.js';
// import { drizzle } from 'drizzle-orm/postgres-js';
// import postgres from 'postgres';
// import dotenv from 'dotenv';
// import { eq } from 'drizzle-orm';

// dotenv.config({ path: './.env' });

// const router = express.Router();
// const client = postgres(process.env.DATABASE_URL);
// const db = drizzle(client, { schema: { Journal }, logger: true });

// router.get('/', async (req, res) => {
//   try {
//     const journals = await db.select().from(Journal);
//     res.json(journals);
//   } catch (error) {
//     console.error('Error fetching journals:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// Helper function to detect cyclic references in JSON
const hasCyclicReference = (obj, seen = new Set()) => {
  if (obj && typeof obj === 'object') {
    if (seen.has(obj)) return true;
    seen.add(obj);
    return Object.values(obj).some(value => hasCyclicReference(value, seen));
  }
  return false;
};

// Create a new journal entry

// router.post('/', async (req, res) => {
//     const {
//       date,
//       journalNumber,
//       referenceNumber,
//       description,
//       accounts,
//       totalDebit,
//       totalCredit,
//     } = req.body;
  

//     if (!date || !journalNumber || !accounts || totalDebit == null || totalCredit == null) {
//       return res.status(400).json({ error: 'Missing required fields' });
//     }
  
//     try {
//       const result = await db.insert(Journal).values({
//         date,
//         journalNumber,
//         referenceNumber,
//         description,
//         accounts: JSON.stringify(accounts), 
//         totalDebit,
//         totalCredit,
//       }).returning('id');
  
//       const journalId = result[0].id;
//       res.status(201).json({ message: 'Journal created successfully', journalId });
//     } catch (error) {
//       console.error('Error creating journal:', error);
//       res.status(500).json({ error: 'Failed to create journal' });
//     }
//   });
  


// router.delete('/', async (req, res) => {
//   const { ids } = req.body;

//   if (!ids || !Array.isArray(ids) || ids.length === 0) {
//     return res.status(400).json({ error: 'No IDs provided for deletion' });
//   }

//   try {
//     for (const id of ids) {
//       await db.delete(Journal).where(eq(Journal.id, id));
//     }
//     res.status(200).json({ message: 'Journal(s) deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting journal:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// export default router;
