import { eq } from "drizzle-orm";
import { db } from ".";
import { employee } from "./schema";
import { env } from "../../config/env.config";
import { Logger } from "../../utils/logger";
import { v4 as uuid } from "uuid";

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
