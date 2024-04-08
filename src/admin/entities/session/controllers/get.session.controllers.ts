import { TokenPayload } from "@/admin/utils/jwt.utils";
import { db } from "@/lib/db";
import { employee_time_session } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { and, asc, eq, sum } from "drizzle-orm";
import { Request, Response } from "express";
import { orderBy } from "lodash";

const handleGetSession = async (
  req: Request<{}, {}, TokenPayload>,
  res: Response
) => {
  try {
    const { id } = req.body.token;

    const sessions = (
      await db
        .select({
          date: employee_time_session.date,
          time: sum(employee_time_session.time),
        })
        .from(employee_time_session)
        .where(
          and(
            eq(employee_time_session.employee_id, id),
            eq(employee_time_session.status, "terminated")
          )
        )
        .groupBy((data) => [data.date])
        .orderBy(asc(employee_time_session.date))
        .limit(7)
    ).map((data) => ({ date: data.date, time: Number(data.time) }));

    // padding sessions if needed
    if (sessions.length !== 7) {
      const remainig = 7 - sessions.length;
      const lastDate = sessions[sessions.length - 1].date;

      for (let i = 1; i <= remainig; i++) {
        const newDate = new Date(lastDate);
        newDate.setDate(newDate.getDate() + i);
        sessions.push({ date: newDate, time: 0 });
      }
    }

    res.status(200).send({ data: sessions, type: "success" });
  } catch (err) {
    Logger.error("handle get session", err);
    res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};

export default handleGetSession;
