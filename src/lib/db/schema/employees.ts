import {
  mysqlTable,
  timestamp,
  varchar,
  mysqlEnum,
} from "drizzle-orm/mysql-core";

// -------------------------------------------------
// Employee
// -------------------------------------------------
export const employee = mysqlTable("employee", {
  id: varchar("id", { length: 36 }).notNull().primaryKey(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  username: varchar("username", { length: 50 }).notNull(),
  password: varchar("password", { length: 100 }).notNull(),
  role: varchar("role", { length: 72 }).notNull(),
  status: mysqlEnum("status", ["active", "deactive"]).notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").onUpdateNow(),
});
export type DbEmployee = typeof employee.$inferSelect;

// -------------------------------------------------
// Employee Privilages
// -------------------------------------------------
export const employee_privilages = mysqlTable("employee_privilages", {
  id: varchar("id", { length: 36 }).notNull().primaryKey(),
  role: mysqlEnum("role", ["employee", "admin", "superadmin"]).notNull(),
  path: varchar("path", { length: 100 }).notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").onUpdateNow(),
});
