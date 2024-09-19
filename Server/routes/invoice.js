    import express from 'express';
    import { eq } from 'drizzle-orm';
    import { Invoice } from '../drizzle/schema.js';
    import { drizzle } from 'drizzle-orm/postgres-js';
    import postgres from 'postgres';
    import dotenv from 'dotenv';

    dotenv.config({ path: './.env' });

    const router = express.Router();
    const client = postgres(process.env.DATABASE_URL);
    const db = drizzle(client, { schema: { Invoice }, logger: true });


    router.post('/', async (req, res) => {
        const {
          name,
          state,
          phone,
          mail,
          invoiceid,
          invdate,
          duedate,
          terms,
          itemdetails, // Should be an array of objects
          subject,
          salesperson,
          taxtype,
          taxrate,
          amount
        } = req.body;
      
        // Verify `itemdetails` is an array before processing
        if (!Array.isArray(itemdetails)) {
          return res.status(400).json({ error: 'itemdetails must be an array' });
        }
      
        try {
          // Insert the invoice data into the database
          const result = await db.insert(Invoice).values({
            name,
            state,
            phone,
            mail,
            invoiceid,
            invdate,
            duedate,
            terms,
            itemdetails: JSON.stringify(itemdetails), // Convert to JSON
            subject,
            salesperson,
            taxtype,
            taxrate,
            amount
          });
      
          // Send a success response
          res.status(201).json({ message: 'Invoice created successfully', result });
        } catch (error) {
          console.error('Error creating invoice:', error);
          res.status(500).json({ error: 'Failed to create invoice' });
        }
      });
      
    
    
    export default router;