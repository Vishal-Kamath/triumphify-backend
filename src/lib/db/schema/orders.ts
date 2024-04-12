import {
  mysqlTable,
  timestamp,
  varchar,
  mysqlEnum,
  text,
  boolean,
  int,
  json,
  unique,
  primaryKey,
  float,
  date,
} from "drizzle-orm/mysql-core";
import { users } from "./users";

// -------------------------------------------------
// Order_details
// -------------------------------------------------
export const order_details = mysqlTable("order_details", {
  id: varchar("id", { length: 36 }).notNull().primaryKey(),
  user_id: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => users.id),

  // payment info
  sub_total: float("sub_total").notNull(),
  discount: float("discount").notNull(),
  coupon_code: varchar("coupon_code", { length: 100 }),
  coupon_discount: float("coupon_discount"),
  total: float("total").notNull(),

  // shipping address info
  shipping_address_name: varchar("shipping_address_name", {
    length: 100,
  }).notNull(),
  shipping_address_street_address: varchar("shipping_address_street_address", {
    length: 150,
  }).notNull(),
  shipping_address_city: varchar("shipping_address_city", {
    length: 100,
  }).notNull(),
  shipping_address_state: varchar("shipping_address_state", {
    length: 100,
  }).notNull(),
  shipping_address_zip: varchar("shipping_address_zip", {
    length: 10,
  }).notNull(),
  shipping_address_country: varchar("shipping_address_country", {
    length: 100,
  }).notNull(),
  shipping_address_tel: varchar("shipping_address_tel", {
    length: 100,
  }).notNull(),
  shipping_address_email: varchar("shipping_address_email", {
    length: 100,
  }).notNull(),

  // billing address info
  billing_address_name: varchar("billing_address_name", {
    length: 100,
  }).notNull(),
  billing_address_street_address: varchar("billing_address_street_address", {
    length: 150,
  }).notNull(),
  billing_address_city: varchar("billing_address_city", {
    length: 100,
  }).notNull(),
  billing_address_state: varchar("billing_address_state", {
    length: 100,
  }).notNull(),
  billing_address_zip: varchar("billing_address_zip", { length: 10 }).notNull(),
  billing_address_country: varchar("billing_address_country", {
    length: 100,
  }).notNull(),
  billing_address_tel: varchar("billing_address_tel", {
    length: 100,
  }).notNull(),
  billing_address_email: varchar("billing_address_email", {
    length: 100,
  }).notNull(),

  created_date: date("created_date").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").onUpdateNow(),
});

// -------------------------------------------------
// Orders
// -------------------------------------------------
export const orders = mysqlTable("orders", {
  id: varchar("id", { length: 36 }).notNull().primaryKey(),
  group_id: varchar("group_id", { length: 36 })
    .notNull()
    .references(() => order_details.id),
  user_id: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => users.id),

  // product details
  product_id: varchar("product_id", { length: 36 }).notNull(),
  product_name: varchar("product_name", { length: 100 }).notNull(),
  product_slug: varchar("product_slug", { length: 100 }).notNull(),
  product_image: varchar("product_image", { length: 350 }),
  product_brand_name: varchar("product_brand_name", { length: 100 }).notNull(),
  product_description: varchar("product_description", { length: 750 }),
  product_quantity: int("product_quantity").notNull(),

  // product variations
  product_variation_key: varchar("product_variation_key", {
    length: 100,
  }).notNull(),
  product_variation_combinations: json(
    "product_variation_combinations"
  ).notNull(),
  product_variation_discount: float("product_variation_discount").notNull(),
  product_variation_discount_price: float(
    "product_variation_discount_price"
  ).notNull(),
  product_variation_discount_final_price: float(
    "product_variation_discount_final_price"
  ).notNull(),
  product_variation_price: float("product_variation_price").notNull(),
  product_variation_final_price: float(
    "product_variation_final_price"
  ).notNull(),

  // order statuses
  cancelled: boolean("cancelled"),
  returned: boolean("returned"),

  status: mysqlEnum("status", [
    // order status
    "pending",
    "confirmed",
    "out for delivery",
    "delivered",

    // return status
    "return approved",
    "out for pickup",
    "picked up",
    "refunded",
  ]).notNull(),

  created_date: date("created_date"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").onUpdateNow(),
});
export type DbOrders = typeof orders.$inferSelect;

// // -------------------------------------------------
// // Order Request
// // -------------------------------------------------
// export const order_cancel_return_request = mysqlTable(
//   "order_cancel_return_request",
//   {
//     id: varchar("id", { length: 36 }).notNull().primaryKey(),
//     order_id: varchar("order_id", { length: 36 })
//       .notNull()
//       .references(() => orders.id),

//     user_id: varchar("user_id", { length: 36 })
//       .notNull()
//       .references(() => users.id),

//     type: mysqlEnum("type", ["cancel", "return"]).notNull(),
//     reason: varchar("reason", { length: 750 }).notNull(),
//     status: mysqlEnum("status", ["pending", "approved", "rejected"])
//       .notNull()
//       .default("pending"),

//     created_at: timestamp("created_at").notNull().defaultNow(),
//     update_at: timestamp("update_at").onUpdateNow(),
//   }
// );
