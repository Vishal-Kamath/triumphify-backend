import {
  mysqlTable,
  timestamp,
  varchar,
  mysqlEnum,
  text,
} from "drizzle-orm/mysql-core";

// -------------------------------------------------
// Task
// -------------------------------------------------
export const tasks = mysqlTable("tasks", {
  id: varchar("id", { length: 36 }).notNull().primaryKey(),
  assigned: varchar("assigned", { length: 36 }),
  title: varchar("title", { length: 100 }).notNull(),
  description: text("description").notNull(),
  status: mysqlEnum("status", ["pending", "completed", "failed"]).notNull(),
  type: mysqlEnum("type", ["order", "support", "request", "misc"]).notNull(),
  link: varchar("link", { length: 36 }),

  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").onUpdateNow(),
});

// -------------------------------------------------
// Leads
// -------------------------------------------------
export const leads = mysqlTable("leads", {
  id: varchar("id", { length: 36 }).notNull().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  tel: varchar("tel", { length: 100 }).notNull(),
  source: varchar("source", { length: 100 }).notNull(),
  assigned: varchar("assigned", { length: 36 }),
  status: mysqlEnum("status", ["pending", "converted", "rejected"]).notNull(),
  last_contacted: timestamp("last_contacted"),

  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").onUpdateNow(),
});
