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
      "/users/tickets",
      "/users/tickets/:id",

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

      // blog
      "/blog/posts",
      "/blog/write",
      "/blog/:id",
    ],
  },
  {
    role: "admin",
    paths: [
      "/users/accounts",

      "/employees/details",
      "/employees/leads",
      "/employees/actions",
      "/employees/actions/:id",
      "/employees/tickets",
      "/employees/tickets/:id",

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

      // blog
      "/blog/posts",
      "/blog/write",
      "/blog/:id",
    ],
  },
  {
    role: "superadmin",
    paths: [
      "/analytics",
      "/users/stats",

      "/employees/details",
      "/employees/details/:id",
      "/employees/logs",
      "/employees/logs/:name",
      "/employees/create",
      "/employees/leads",
      "/employees/actions",
      "/employees/actions/:id",
      "/employees/tickets",
      "/employees/tickets/:id",

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

      // blog
      "/blog/posts",
      "/blog/write",
      "/blog/:id",

      // config
      "/config/gtm",
      "/config/payment",
    ],
  },
];

async function generatePrivilages() {
  await db.delete(employee_privilages);
  for (const privilage of privilages) {
    const role = privilage.role;
    for (const path of privilage.paths) {
      await db.insert(employee_privilages).values({
        id: uuid(),
        path,
        role,
      });
    }
  }

  Logger.success("Privilages updated");
  return process.exit(0);
}

generatePrivilages();
