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
// Employee
// -------------------------------------------------
export const employee = mysqlTable("employee", {
  id: varchar("id", { length: 36 }).notNull().primaryKey(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  username: varchar("username", { length: 50 }).notNull(),
  password: varchar("password", { length: 100 }).notNull(),
  role: varchar("role", { length: 72 }).notNull(),
  status: mysqlEnum("status", ["active", "deactive"]).notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").onUpdateNow(),
});
export type DbEmployee = typeof employee.$inferSelect;

// -------------------------------------------------
// Employee Privilages
// -------------------------------------------------
export const employee_privilages = mysqlTable("employee_privilages", {
  id: varchar("id", { length: 36 }).notNull().primaryKey(),
  role: mysqlEnum("role", ["employee", "admin", "superadmin"]).notNull(),
  path: varchar("path", { length: 100 }).notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").onUpdateNow(),
});

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
  values: json("values").notNull(),

  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").onUpdateNow(),
});

// -------------------------------------------------
// Variant
// -------------------------------------------------
// export const variant = mysqlTable("variant", {
//   id: varchar("id", { length: 36 }).notNull().primaryKey(),
//   attribute_id: varchar("id", { length: 36 })
//     .notNull()
//     .references(() => attributes.id),
//   name: varchar("name", { length: 100 }).notNull(),
// });

// -------------------------------------------------
// Product
// -------------------------------------------------
export const products = mysqlTable("products", {
  id: varchar("id", { length: 36 }).notNull().primaryKey(),

  // data
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  brand_name: varchar("brand_name", { length: 100 }).notNull(),
  category_id: varchar("category_id", { length: 36 })
    .notNull()
    .references(() => categories.id),

  description: varchar("description", { length: 750 }),
  product_accordians: json("product_accordians").notNull(),
  product_images: json("product_images").notNull(),

  // meta data
  meta_title: varchar("meta_title", { length: 100 }),
  meta_description: varchar("meta_description", { length: 250 }),
  meta_keywords: varchar("meta_keywords", { length: 100 }),

  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").onUpdateNow(),
});

// -------------------------------------------------
// Product Attributes
// -------------------------------------------------
export const product_attributes = mysqlTable(
  "product_attributes",
  {
    id: varchar("id", { length: 36 }).notNull().primaryKey(),
    product_id: varchar("product_id", { length: 36 })
      .notNull()
      .references(() => products.id),

    key: varchar("key", { length: 100 }).notNull(),
    parent: varchar("parent", { length: 100 }).notNull(),
    value: varchar("value", { length: 100 }).notNull(),

    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").onUpdateNow(),
  },
  (table) => ({
    unique_product_id_key: unique().on(table.product_id, table.key),
  })
);

// -------------------------------------------------
// Product Variations
// -------------------------------------------------
export const product_variations = mysqlTable(
  "product_variations",
  {
    id: varchar("id", { length: 36 }).notNull().primaryKey(),
    product_id: varchar("product_id", { length: 36 })
      .notNull()
      .references(() => products.id),

    key: varchar("key", { length: 100 }).notNull(),
    combinations: json("combinations").notNull(),
    quantity: float("quantity").notNull(),
    discount: float("discount").notNull(),
    price: float("price").notNull(),

    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").onUpdateNow(),
  },
  (table) => ({
    unique_product_id_key: unique().on(table.product_id, table.key),
  })
);

// -------------------------------------------------
// Banner
// -------------------------------------------------
export const banner = mysqlTable("banner", {
  id: varchar("id", { length: 36 }).notNull().primaryKey(),
  link: varchar("link", { length: 350 }),

  type: mysqlEnum("type", ["main", "sub"]).notNull(),
  is_published: boolean("is_published").notNull(),

  banner_image_desktop: varchar("banner_image_desktop", { length: 350 }),
  banner_image_mobile: varchar("banner_image_mobile", { length: 350 }),

  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").onUpdateNow(),
});

// -------------------------------------------------
// Product showcase
// -------------------------------------------------
export const product_showcase = mysqlTable("product_showcase", {
  id: varchar("id", { length: 36 }).notNull().primaryKey(),
  product_id: varchar("product_id", { length: 36 })
    .notNull()
    .references(() => products.id),

  index: int("index").notNull(),
  template: mysqlEnum("template", ["A", "B", "C"]).notNull(),
  content: json("content").notNull(),

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

  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").onUpdateNow(),
});
export type DbOrders = typeof orders.$inferSelect;

// -------------------------------------------------
// Order Request
// -------------------------------------------------
export const order_cancel_return_request = mysqlTable(
  "order_cancel_return_request",
  {
    id: varchar("id", { length: 36 }).notNull().primaryKey(),
    order_id: varchar("order_id", { length: 36 })
      .notNull()
      .references(() => orders.id),

    user_id: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id),

    type: mysqlEnum("type", ["cancel", "return"]).notNull(),
    reason: varchar("reason", { length: 750 }).notNull(),
    status: mysqlEnum("status", ["pending", "approved", "rejected"])
      .notNull()
      .default("pending"),

    created_at: timestamp("created_at").notNull().defaultNow(),
    update_at: timestamp("update_at").onUpdateNow(),
  }
);

// -------------------------------------------------
// Reviews
// -------------------------------------------------
export const reviews = mysqlTable("reviews", {
  id: varchar("id", { length: 36 }).notNull().primaryKey(),
  user_id: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => users.id),
  product_id: varchar("product_id", { length: 36 })
    .notNull()
    .references(() => products.id),

  pinned: boolean("pinned").notNull().default(true),

  rating: int("rating").notNull(),
  review_title: varchar("review_title", { length: 100 }).notNull(),
  review_description: varchar("review_description", {
    length: 750,
  }).notNull(),

  status: mysqlEnum("status", ["pending", "approved", "rejected"])
    .default("pending")
    .notNull(),

  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").onUpdateNow(),
});
