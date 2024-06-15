import * as dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";
dotenv.config({ path: ".env" });

export default defineConfig({
  driver: "mysql2",
  schema: "./src/lib/db/schema",
  dbCredentials: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
});
