import { int, mysqlEnum, mysqlTable } from "drizzle-orm/mysql-core";
import { encryptedJSON } from "./util";

export const websiteConfigs = mysqlTable("website_configs", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", ["google_tag_manager"]),
  content: encryptedJSON("content"),
});
