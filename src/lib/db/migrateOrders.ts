import { env } from "../../config/env.config";
import { Logger } from "../../utils/logger";
import mysql from "mysql2";
import { drizzle } from "drizzle-orm/mysql2";
import fs from "fs";
import { order_details, orders } from "./schema";
import { eq } from "drizzle-orm";

const pool = mysql.createPool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
});

const db = drizzle(pool);

async function migrateOrders() {
  try {
    const getallOrders = await db.select().from(orders);
    const getAllOrderDetails = await db.select().from(order_details);

    for (const details of getAllOrderDetails) {
      await db
        .update(orders)
        .set({
          created_date: new Date(details.created_at),
        })
        .where(eq(order_details.id, details.id));
    }
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
  } catch (Err) {
    console.log(Err);
  }
}

migrateOrders();
