import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const client = new Pool({
  connectionString: process.env.DATABASE_URL as string,
  ssl: {
    rejectUnauthorized: true,
  },
});

export default client;