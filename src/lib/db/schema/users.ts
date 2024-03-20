import {
  boolean,
  int,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { product_variations, products } from "./products";

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
  tel: varchar("tel", { length: 100 }),
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
// Addresses
// -------------------------------------------------
export const addresses = mysqlTable("addresses", {
  id: varchar("id", { length: 36 }).notNull().primaryKey(),
  user_id: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => users.id),
  name: varchar("name", { length: 100 }).notNull(),
  street_address: varchar("street_address", { length: 150 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }).notNull(),
  zip: varchar("zip", { length: 10 }).notNull(),
  country: varchar("country", { length: 100 }).notNull(),
  tel: varchar("tel", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").onUpdateNow(),
});

// -------------------------------------------------
// Wishlist
// -------------------------------------------------
export const wishlist = mysqlTable(
  "wishlist",
  {
    user_id: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id),
    product_id: varchar("product_id", { length: 36 })
      .notNull()
      .references(() => products.id),
  },
  (table) => ({
    unique_user_product_id: primaryKey({
      name: "unique_user_product_id",
      columns: [table.user_id, table.product_id],
    }),
  })
);

// -------------------------------------------------
// Cart
// -------------------------------------------------
export const cart = mysqlTable("carts", {
  id: varchar("id", { length: 36 }).notNull().primaryKey(),
  user_id: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => users.id),
  product_id: varchar("product_id", { length: 36 })
    .notNull()
    .references(() => products.id),
  product_variation_id: varchar("product_variation_id", { length: 36 })
    .notNull()
    .references(() => product_variations.id),

  quantity: int("quantity").notNull(),

  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").onUpdateNow(),
});
