import { eq } from "drizzle-orm";
import { employee, orders } from "./schema";
import { env } from "../../config/env.config";
import { Logger } from "../../utils/logger";
import mysql from "mysql2";
import { drizzle } from "drizzle-orm/mysql2";
import { v4 as uuid } from "uuid";

const pool = mysql.createPool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
});

const db = drizzle(pool);

async function migrateOrders() {
  const getallOrders = await db.select().from(orders);

  for (const order of getallOrders) {
    await db
      .update(orders)
      .set({
        created_date: new Date(order.created_at),
      })
      .where(eq(orders.id, order.id));
  }
  Logger.success("Orders migrated");
  return process.exit(0);
}

migrateOrders();
