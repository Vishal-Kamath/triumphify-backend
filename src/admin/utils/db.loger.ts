import { db } from "@/lib/db";
import { employeeLogs } from "@/lib/db/schema";
import { v4 as uuid } from "uuid";

class DbLogger {
  static async error(id: string, ...msg: any[]) {
    const logId = uuid();
    const message = msg.map((val) => String(val)).join(" ");
    const type = "error";
    await db.insert(employeeLogs).values({
      id: logId,
      message,
      type,
      employee_id: id,
    });
  }
  static async warn(id: string, ...msg: any[]) {
    const logId = uuid();
    const message = msg.map((val) => String(val)).join(" ");
    const type = "warning";
    await db.insert(employeeLogs).values({
      id: logId,
      message,
      type,
      employee_id: id,
    });
  }
  static async info(id: string, ...msg: any[]) {
    const logId = uuid();
    const message = msg.map((val) => String(val)).join(" ");
    const type = "info";
    await db.insert(employeeLogs).values({
      id: logId,
      message,
      type,
      employee_id: id,
    });
  }
  static async success(id: string, ...msg: any[]) {
    const logId = uuid();
    const message = msg.map((val) => String(val)).join(" ");
    const type = "success";
    await db.insert(employeeLogs).values({
      id: logId,
      message,
      type,
      employee_id: id,
    });
  }
}
