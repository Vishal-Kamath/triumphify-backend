import {
  mysqlTable,
  timestamp,
  varchar,
  mysqlEnum,
  text,
} from "drizzle-orm/mysql-core";

// -------------------------------------------------
// Login OTP
// -------------------------------------------------
export const otp = mysqlTable("otp", {
  email: varchar("email", { length: 100 }).notNull().primaryKey(),
  otp: varchar("otp", { length: 7 }).notNull(),
  ip: varchar("ip", { length: 100 }).notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

// -------------------------------------------------
// Users
// -------------------------------------------------
export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 }).notNull().primaryKey(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  username: varchar("username", { length: 50 }),
  dateOfBirth: varchar("dateOfBirth", { length: 100 }).notNull(),
  gender: mysqlEnum("gender", ["Male", "Female", "Other"]),
  password: varchar("password", { length: 100 }).notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").onUpdateNow(),
});

// -------------------------------------------------
// Employee
// -------------------------------------------------
export const employee = mysqlTable("employee", {
  id: varchar("id", { length: 36 }).notNull().primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  password: varchar("password", { length: 100 }).notNull(),
  role: varchar("role", { length: 72 }).notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").onUpdateNow(),
});

// -------------------------------------------------
// Employee Logs
// -------------------------------------------------
export const employeeLogs = mysqlTable("employeeLogs", {
  id: varchar("id", { length: 36 }).notNull().primaryKey(),
  employee_id: varchar("employee_id", { length: 36 }).notNull(),
  message: text("message").notNull(),
  type: mysqlEnum("type", ["success", "error", "info", "warning"]).notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});
