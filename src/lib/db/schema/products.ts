import {
  boolean,
  float,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/mysql-core";
import { users } from "./users";

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
