import express from 'express';
import { drizzle } from 'drizzle-orm/postgres-js';
import { Users } from '../drizzle/schema.js';
import postgres from 'postgres';
import multer from 'multer';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: '../.env' });

const router = express.Router();
const client = postgres(process.env.DATABASE_URL);
const db4 = drizzle(client, { schema: { Users }, logger: true });

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join('uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});
const upload = multer({ storage });

// Sign-up (Add new user)
router.post('/', upload.single('documents'), async (req, res) => {
  const {
    companyName,
    companyEmail,
    password,
    address,
    phoneNumber: phone,
    gstNumber: gst,
    panNumber: pan,
  } = req.body;
  const documentPath = req.file?.path;

  try {
    // Insert user into the database
    const [newUser] = await db4
      .insert(Users)
      .values({
        name: companyName,
        mail: companyEmail,
        password,
        address,
        phone: Number(phone),
        gst,
        pan,
        docs: documentPath, // Use correct column name 'docs'
      })
      .returning();

    

    res.status(201).json({ user: newUser});
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


export default router;
