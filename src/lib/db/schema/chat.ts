import {
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const conversation = mysqlTable("conversation", {
  room: varchar("room", { length: 36 }).notNull().primaryKey(),
  user_id: varchar("user_id", { length: 36 }),

  status: mysqlEnum("status", ["new", "ongoing", "closed"]).notNull(),

  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").onUpdateNow(),
});

export const chat = mysqlTable("chat", {
  id: varchar("id", { length: 36 }).notNull().primaryKey(),

  room_id: varchar("room_id", { length: 36 })
    .notNull()
    .references(() => conversation.room),
  msg: text("msg"),
  sender: mysqlEnum("sender", ["customer", "operator"]),
  sender_id: varchar("sender_id", { length: 36 }).notNull(),

  created_at: timestamp("created_at").notNull().defaultNow(),
});
