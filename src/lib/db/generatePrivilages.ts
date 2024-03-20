import { eq } from "drizzle-orm";
import { employee, employee_privilages } from "./schema";
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

interface Privilage {
  role: "employee" | "admin" | "superadmin";
  paths: string[];
}
const privilages: Privilage[] = [
  {
    role: "employee",
    paths: [
      "/users/accounts",
      "/users/leads",

      // Products
      "/products/create",

      "/products/details",
      "/products/details/:id",

      "/products/attributes",
      "/products/attributes/:id",
      "/products/attributes/create",

      "/products/categories",
      "/products/categories/:id",
      "/products/categories/create",

      "/products/reviews",
      "/products/reviews/:id",

      "/products/showcase",
      "/products/showcase/:id",

      // Orders
      "/orders/details",
      "/orders/details/:id",

      // Banners
      "/banners/:type",
      "/banners/:type/:id",
      "/banners/:type/create",
      "/banners/main",
      "/banners/sub",
    ],
  },
  {
    role: "admin",
    paths: [
      "/users/accounts",

      "/employees/details",
      "/employees/leads",
      "/employees/tickets",

      // Products
      "/products/create",

      "/products/details",
      "/products/details/:id",

      "/products/attributes",
      "/products/attributes/:id",
      "/products/attributes/create",

      "/products/categories",
      "/products/categories/:id",
      "/products/categories/create",

      "/products/reviews",
      "/products/reviews/:id",

      "/products/showcase",
      "/products/showcase/:id",

      // Orders
      "/orders/details",
      "/orders/details/:id",

      // Banners
      "/banners/:type",
      "/banners/:type/:id",
      "/banners/:type/create",
      "/banners/main",
      "/banners/sub",
    ],
  },
  {
    role: "superadmin",
    paths: [
      "/users/stats",

      "/employees/details",
      "/employees/details/:id",
      "/employees/logs",
      "/employees/logs/:name",
      "/employees/create",
      "/employees/leads",
      "/employees/tickets",

      // Products
      "/products/create",

      "/products/details",
      "/products/details/:id",

      "/products/attributes",
      "/products/attributes/:id",
      "/products/attributes/create",

      "/products/categories",
      "/products/categories/:id",
      "/products/categories/create",

      "/products/reviews",
      "/products/reviews/:id",

      "/products/showcase",
      "/products/showcase/:id",

      // Orders
      "/orders/details",
      "/orders/details/:id",

      "/orders/analytics",
      "/orders/analytics/:id",

      // Banners
      "/banners/:type",
      "/banners/:type/:id",
      "/banners/:type/create",
      "/banners/main",
      "/banners/sub",
    ],
  },
];

async function generatePrivilages() {
  const existingPrivilages = await db.select().from(employee_privilages);

  for (const privilage of privilages) {
    for (const path of privilage.paths) {
      const privilageExists = existingPrivilages.find(
        (p) => p.role === privilage.role && p.path === path
      );
      if (privilageExists) {
        continue;
      }

      await db.insert(employee_privilages).values({
        id: uuid(),
        role: privilage.role,
        path: path,
      });
    }
  }

  Logger.success("Privilages updated");
  return process.exit(0);
}

generatePrivilages();
