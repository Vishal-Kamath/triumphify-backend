import {
  mysqlTable,
  timestamp,
  varchar,
  mysqlEnum,
  text,
  boolean,
  json,
} from "drizzle-orm/mysql-core";
import { users } from "./users";
import { employee } from "./employees";

// -------------------------------------------------
// Leads
// -------------------------------------------------
export const leads = mysqlTable("leads", {
  id: varchar("id", { length: 36 }).notNull().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull(),
  tel: varchar("tel", { length: 100 }).notNull(),
  source: varchar("source", { length: 100 }).notNull(),
  assigned: varchar("assigned", { length: 36 }),
  status: mysqlEnum("status", ["new", "pending", "converted", "rejected"])
    .notNull()
    .default("new"),
  last_contacted: timestamp("last_contacted"),

  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").onUpdateNow(),
});

// -------------------------------------------------
// Actions
// -------------------------------------------------
export const actions = mysqlTable("actions", {
  id: varchar("id", { length: 36 }).notNull().primaryKey(),

  title: varchar("title", { length: 100 }).notNull(),
  subject: varchar("subject", { length: 100 }).notNull(),
  body: text("body").notNull(),

  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").onUpdateNow(),
});

// -------------------------------------------------
// Action Logs
// -------------------------------------------------
export const action_logs = mysqlTable("action_logs", {
  id: varchar("id", { length: 36 }).notNull().primaryKey(),
  action_id: varchar("action_id", { length: 36 })
    .notNull()
    .references(() => actions.id),
  receivers: json("receivers").notNull(),
  triggered_by: varchar("triggered_by", { length: 36 })
    .notNull()
    .references(() => employee.id),
  title: varchar("title", { length: 100 }).notNull(),
  subject: varchar("subject", { length: 100 }).notNull(),
  body: text("body").notNull(),

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

// -------------------------------------------------
// Ticket Chat
// -------------------------------------------------
export const ticket_chats = mysqlTable("ticket_chats", {
  id: varchar("id", { length: 36 }).notNull().primaryKey(),
  user_or_employee_id: varchar("user_or_employee_id", { length: 36 }).notNull(),
  ticket_id: varchar("ticket_id", { length: 36 })
    .notNull()
    .references(() => tickets.id),
  type: mysqlEnum("type", ["user", "employee"]).notNull(),
  content: text("content").notNull(),
  seen: boolean("seen").default(false),
  created_at: timestamp("created_at").notNull().defaultNow(),
});