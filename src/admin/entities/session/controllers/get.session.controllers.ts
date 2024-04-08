import { TokenPayload } from "@/admin/utils/jwt.utils";
import { db } from "@/lib/db";
import { employee_time_session } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { and, eq, sum } from "drizzle-orm";
import { Request, Response } from "express";

const handleGetSession = async (
  req: Request<{}, {}, TokenPayload>,
  res: Response
) => {
  try {
    const { id } = req.body.token;

    const sessions = await db
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
      .limit(7);

    res.status(200).send({ data: sessions, type: "success" });
  } catch (err) {
    Logger.error("handle get session", err);
    res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};

export default handleGetSession;
