import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { and, count, eq, gte, lte } from "drizzle-orm";
import { Request, Response } from "express";

const handleGetNewUsers = async (
  req: Request<{}, {}, {}, { month: number; year: number }>,
  res: Response
) => {
  try {
    const month = req.query.month || new Date().getMonth();
    const year = req.query.year || new Date().getFullYear();

    const start_date = new Date(year, month, 1);
    const end_date = new Date(year, Number(month) + 1, 1);

    console.log(start_date, end_date);

    const newUsers = await db
      .select({
        date: users.created_at,
        count: count(users.created_at),
      })
      .from(users)
      .where(
        and(gte(users.created_at, start_date), lte(users.created_at, end_date))
      )
      .groupBy((data) => [data.date]);

    res.status(200).send({
      data: newUsers,
      type: "success",
    });
  } catch (err) {
    Logger.error("handle get new users", err);
    res.status(500).send({
      description: "something went wrong",
      type: "error",
    });
  }
};

export default handleGetNewUsers;
