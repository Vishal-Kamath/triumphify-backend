import { db } from "@/lib/db";
import { employee_time_session } from "@/lib/db/schema";
import { convertUTCDateToLocalDate } from "@/utils/getUTCDate";
import { and, eq, sql } from "drizzle-orm";

export class EmployeeSessionService {
  private service_id: string;
  private employee_id: string;
  private date: Date;

  constructor(service_id: string, employee_id: string) {
    this.service_id = service_id;
    this.employee_id = employee_id;
    this.date = convertUTCDateToLocalDate(new Date());
    this.startSession();
  }

  getEmployeeId() {
    return this.employee_id;
  }
  getDate() {
    return this.date;
  }

  async startSession() {
    await db.insert(employee_time_session).values({
      service_id: this.service_id,
      employee_id: this.employee_id,
      status: "ongoing",
      date: this.date,
    });
  }

  async endSession() {
    await db
      .update(employee_time_session)
      .set({
        status: "terminated",
      })
      .where(
        and(
          eq(employee_time_session.service_id, this.service_id),
          eq(employee_time_session.employee_id, this.employee_id)
        )
      );
  }

  async updateTime(time: number) {
    await db
      .update(employee_time_session)
      .set({ time })
      .where(
        and(
          eq(employee_time_session.service_id, this.service_id),
          eq(employee_time_session.employee_id, this.employee_id)
        )
      );
  }
}
