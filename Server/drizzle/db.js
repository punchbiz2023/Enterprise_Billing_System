import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema"
import postgres from "postgres";

import dotenv from 'dotenv';
dotenv.config({ path: "./.env" });
console.log(process.env.DATABASE_URL);


const client = postgres(process.env.DATABASE_URL)
export const db = drizzle(client,{schema,logger})