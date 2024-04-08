import {
  mysqlTable,
  timestamp,
  varchar,
  mysqlEnum,
  date,
  int,
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

// -------------------------------------------------
// Employee Time Session
// -------------------------------------------------
export const employee_time_session = mysqlTable("employee_time_session", {
  service_id: varchar("service_id", { length: 36 }).notNull().primaryKey(),
  employee_id: varchar("id", { length: 36 })
    .notNull()
    .references(() => employee.id),
  status: mysqlEnum("status", ["ongoing", "terminated"]).notNull(),
  time: int("time").notNull().default(0),
  date: date("date").notNull(),
  started_at: timestamp("started_at").notNull().defaultNow(),
  ended_at: timestamp("ended_at").onUpdateNow(),
});