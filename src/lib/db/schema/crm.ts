import {
  mysqlTable,
  timestamp,
  varchar,
  mysqlEnum,
  text,
} from "drizzle-orm/mysql-core";
import { users } from "./users";

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

// -------------------------------------------------
// Tickets
// -------------------------------------------------
export const tickets = mysqlTable("tickets", {
  id: varchar("id", { length: 36 }).notNull().primaryKey(),
  assigned: varchar("assigned", { length: 36 }),
  link: varchar("link", { length: 200 }),
  user_id: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => users.id),

  title: varchar("title", { length: 100 }).notNull(),
  description: varchar("description", { length: 750 }).notNull(),
  status: mysqlEnum("status", ["pending", "completed", "failed"]).notNull(),

  type: mysqlEnum("type", ["order", "support", "request", "misc"]).notNull(),

  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").onUpdateNow(),
});