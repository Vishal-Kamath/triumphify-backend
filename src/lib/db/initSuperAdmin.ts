import { eq } from "drizzle-orm";
import { employee } from "./schema";
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

async function initSuperAdmin() {
  const superAdminExists = (
    await db
      .select()
      .from(employee)
      .where(eq(employee.email, env.SUPER_ADMIN_EMAIL))
      .limit(1)
  )[0];
  if (superAdminExists) {
    Logger.info("Super admin email already exists");
    return process.exit(0);
  }

  await db.insert(employee).values({
    id: uuid(),
    email: env.SUPER_ADMIN_EMAIL,
    password: env.SUPER_ADMIN_PASSWORD_HASH,
    role: env.SUPERADMIN,
    status: "active",
    username: "Superadmin",
  });
  Logger.success("Super admin created successfully");
  return process.exit(0);
}

initSuperAdmin();
