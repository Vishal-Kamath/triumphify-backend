import { customType, mysqlTable } from "drizzle-orm/mysql-core";
import { Encrypt } from "../utils";

export const encryptedText = customType<{ data: string }>({
  dataType() {
    return "text";
  },
  fromDriver(value: unknown) {
    return Encrypt.decrypt(value! as string);
  },
  toDriver(value: string) {
    return Encrypt.encrypt(value);
  },
});

export const encryptedVarchar = customType<{ data: string }>({
  dataType() {
    return "varchar(255)";
  },
  fromDriver(value: unknown) {
    return Encrypt.decrypt(value! as string);
  },
  toDriver(value: string) {
    return Encrypt.encrypt(value);
  },
});

export const encryptedJSON = customType<{ data: string }>({
  dataType() {
    return "json";
  },
  fromDriver(value: unknown) {
    return Encrypt.decrypt(value! as string);
  },
  toDriver(value: string) {
    return Encrypt.encrypt(value);
  },
});
