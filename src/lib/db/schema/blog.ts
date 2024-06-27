import {
  boolean,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { employee } from "./employees";

// -------------------------------------------------
// Blogs
// -------------------------------------------------
export const blogs = mysqlTable("blogs", {
  id: varchar("id", { length: 36 }).notNull().primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),

  image: text("image").notNull(),
  title: varchar("title", { length: 255 }).notNull(),

  linked_to_main_banner: boolean("linked_to_main_banner"),

  created_by: varchar("created_by", { length: 36 })
    .notNull()
    .references(() => employee.id),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").onUpdateNow(),
});

// -------------------------------------------------
// Blog Sections
// -------------------------------------------------
export const blog_section = mysqlTable("blogs_section", {
  id: varchar("id", { length: 36 }).notNull().primaryKey(),
  blogId: varchar("blogId", { length: 36 })
    .notNull()
    .references(() => blogs.id),
  order: int("order").notNull().default(0),

  type: mysqlEnum("type", ["image", "title", "h1", "h2", "text"]).notNull(),
  content: json("content").notNull(),

  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").onUpdateNow(),
});
