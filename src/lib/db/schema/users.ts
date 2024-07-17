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
import { encryptedText, encryptedVarchar } from "./util";

// -------------------------------------------------
// Login OTP
// -------------------------------------------------
export const otpVerification = mysqlTable("otpVerification", {
  email: encryptedVarchar("email").notNull().primaryKey(),
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
  email: encryptedVarchar("email").notNull().unique(),
  emailVerified: boolean("emailVerified"),
  tel: encryptedText("tel"),
  username: encryptedText("username"),
  dateOfBirth: encryptedText("dateOfBirth"),
  gender: mysqlEnum("gender", ["Male", "Female", "Other"]),
  password: varchar("password", { length: 100 }).notNull(),
  googleId: encryptedText("googleId"),
  image: encryptedText("image"),
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
  name: encryptedText("name").notNull(),
  street_address: encryptedText("street_address").notNull(),
  city: encryptedText("city").notNull(),
  state: encryptedText("state").notNull(),
  zip: encryptedText("zip").notNull(),
  country: encryptedText("country").notNull(),
  tel: encryptedText("tel").notNull(),
  email: encryptedText("email").notNull(),
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
