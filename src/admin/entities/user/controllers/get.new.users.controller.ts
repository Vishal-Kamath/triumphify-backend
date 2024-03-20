import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { convertUTCDateToLocalDateString } from "@/utils/getUTCDate";
import { Logger } from "@/utils/logger";
import { and, gte, lte } from "drizzle-orm";
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

    const dates = Array(Number(new Date(year, Number(month) + 1, 0).getDate()))
      .fill(0)
      .map((_, i) => ({
        date: new Date(
          convertUTCDateToLocalDateString(new Date(year, month, i + 1)) || ""
        ),
        count: 0,
      }));

    const newUsers = (
      await db
        .select({
          date: users.created_at,
        })
        .from(users)
        .where(
          and(
            gte(users.created_at, start_date),
            lte(users.created_at, end_date)
          )
        )
    ).reduce((acc: { date: Date; count: number }[], userSignIn) => {
      const signInDate = new Date(
        convertUTCDateToLocalDateString(
          new Date(
            userSignIn.date.getFullYear(),
            userSignIn.date.getMonth(),
            userSignIn.date.getDate()
          )
        ) || ""
      );

      const existingSignInDate = acc.find(
        (signIn) => signIn.date.getTime() === signInDate.getTime()
      );
      if (existingSignInDate) {
        existingSignInDate.count++;
      } else {
        acc.push({ date: signInDate, count: 1 });
      }

      return acc;
    }, []);

    newUsers.forEach((user) => {
      const dateIndex = dates.findIndex(
        (date) => date.date.getTime() === user.date.getTime()
      );
      if (dateIndex !== -1) {
        dates[dateIndex].count = user.count;
      }
    });

    res.status(200).send({
      data: dates,
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
