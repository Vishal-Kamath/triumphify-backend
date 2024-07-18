import { int, json, mysqlEnum, mysqlTable } from "drizzle-orm/mysql-core";

export const websiteConfigs = mysqlTable("website_configs", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", ["google_tag_manager"]),
  content: json("content"),
});
