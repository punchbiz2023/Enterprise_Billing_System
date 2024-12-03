import express from 'express';
import { drizzle } from 'drizzle-orm/postgres-js';
import { Project } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const router = express.Router();
const client = postgres(process.env.DATABASE_URL);
const db = drizzle(client, { schema: { Project }, logger: true });


router.get('/', async (req, res) => {
  const {loggedUser} = req.query
    try {
      const projects = await db.select().from(Project).where(eq(Project.loggedUser,loggedUser));
      res.json(projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

router.post('/', async (req, res) => {
  try {
    const {
      projectName,     // corresponds to 'name'
      projectCode,     // corresponds to 'pcode'
      customerName,    // corresponds to 'cname'
      billingMethod,    // corresponds to 'billmethod'
      totalProjectCost, // corresponds to 'total'
      description,
      costBudget,      // corresponds to 'costbudget'
      revenueBudget,    // corresponds to 'revenuebudget'
      hoursBudgetType,  // corresponds to 'projecthours'
      users,
      tasks,
      loggedUser
    } = req.body;

    const [project] = await db
      .insert(Project)
      .values({
        name: projectName,
        pcode: projectCode,
        cname: customerName,
        billmethod: billingMethod,
        total: totalProjectCost,
        description,
        costbudget: costBudget,
        revenuebudget: revenueBudget,
        projecthours: hoursBudgetType,
        users: JSON.stringify(users),
        tasks: JSON.stringify(tasks),
        loggedUser
      })
      .returning();

    res.status(201).json({ message: 'Project created successfully', project });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
