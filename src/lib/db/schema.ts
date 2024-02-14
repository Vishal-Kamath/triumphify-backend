import {
  mysqlTable,
  timestamp,
  varchar,
  mysqlEnum,
  text,
  boolean,
  int,
} from "drizzle-orm/mysql-core";

// -------------------------------------------------
// Login OTP
// -------------------------------------------------
export const otpVerification = mysqlTable("otpVerification", {
  email: varchar("email", { length: 100 }).notNull().primaryKey(),
  otp: varchar("otp", { length: 7 }).notNull(),
  ip: varchar("ip", { length: 100 }),
  for: varchar("for", { length: 100 }).notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

// -------------------------------------------------
// Users
// -------------------------------------------------
export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 }).notNull().primaryKey(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  emailVerified: boolean("emailVerified"),
  username: varchar("username", { length: 50 }),
  dateOfBirth: varchar("dateOfBirth", { length: 100 }),
  gender: mysqlEnum("gender", ["Male", "Female", "Other"]),
  password: varchar("password", { length: 100 }).notNull(),
  googleId: varchar("googleId", { length: 100 }),
  image: varchar("image", { length: 350 }),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").onUpdateNow(),
});
export type DbUser = typeof users.$inferSelect;

// -------------------------------------------------
// Employee
// -------------------------------------------------
export const employee = mysqlTable("employee", {
  id: varchar("id", { length: 36 }).notNull().primaryKey(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  username: varchar("username", { length: 50 }).notNull(),
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
  employee_id: varchar("employee_id", { length: 36 })
    .notNull()
    .references(() => employee.id),
  message: text("message").notNull(),
  type: mysqlEnum("type", ["success", "error", "info", "warning"]).notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

// -------------------------------------------------
// Category
// -------------------------------------------------
export const categories = mysqlTable("categories", {
  id: varchar("id", { length: 36 }).notNull().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  description: varchar("description", { length: 500 }).notNull(),
  category_image: varchar("category_image", { length: 350 }),

  // meta data
  meta_title: varchar("meta_title", { length: 100 }),
  meta_description: varchar("meta_description", { length: 100 }),
  meta_keywords: varchar("meta_keywords", { length: 100 }),

  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").onUpdateNow(),
});

// -------------------------------------------------
// Attributes
// -------------------------------------------------
export const attributes = mysqlTable("attributes", {
  id: varchar("id", { length: 36 }).notNull().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),

  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").onUpdateNow(),
});

// -------------------------------------------------
// Variant
// -------------------------------------------------
export const variant = mysqlTable("variant", {
  id: varchar("id", { length: 36 }).notNull().primaryKey(),
  attribute_id: varchar("id", { length: 36 })
    .notNull()
    .references(() => attributes.id),
  name: varchar("name", { length: 100 }).notNull(),
});

// -------------------------------------------------
// Product
// -------------------------------------------------
export const products = mysqlTable("products", {
  id: varchar("id", { length: 36 }).notNull().primaryKey(),

  // data
  name: varchar("name", { length: 100 }).notNull(),
  brand_name: varchar("brand_name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: varchar("description", { length: 1500 }).notNull(),
  usage: varchar("usage", { length: 750 }).notNull(),
  price: int("price").notNull(),
  gst_price: int("gst_price").notNull(),

  // status
  is_featured: boolean("is_featured").notNull(),
  is_new_arrival: boolean("is_new_arrival").notNull(),
  is_best_seller: boolean("is_best_seller").notNull(),

  // meta data
  meta_title: varchar("meta_title", { length: 100 }),
  meta_description: varchar("meta_description", { length: 100 }),
  meta_keywords: varchar("meta_keywords", { length: 100 }),

  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").onUpdateNow(),
});

// -------------------------------------------------
// Product Images
// -------------------------------------------------
export const product_images = mysqlTable("product_images", {
  id: varchar("id", { length: 36 }).notNull().primaryKey(),
  product_id: varchar("id", { length: 36 })
    .notNull()
    .references(() => products.id),
  link: varchar("category_image", { length: 350 }),
});
