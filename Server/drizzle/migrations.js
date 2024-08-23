import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';


const migrationClient = postgres("postgresql://Cust_owner:r8hsABpTxv9N@ep-ancient-snowflake-a5bzfr5d.us-east-2.aws.neon.tech/Cust?sslmode=require", { max: 1 });

async function main() {
    await migrate(drizzle(migrationClient), {
        migrationsFolder: "../drizzle/migrations"
    })
    await migrationClient.end()
}


main()