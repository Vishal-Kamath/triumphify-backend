import { TokenPayload } from "@/app/utils/jwt.utils";
import { db } from "@/lib/db";
import { tickets, users } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { and, eq } from "drizzle-orm";
import { Request, Response } from "express";

const handleGetAllTickets = async (
  req: Request<
    {},
    {},
    TokenPayload,
    { status?: "pending" | "completed" | "failed" }
  >,
  res: Response
) => {
  try {
    const { id } = req.body.token;
    const status = req.query.status;

    const statusCondition = status ? eq(tickets.status, status) : undefined;
    const body = {
      id: tickets.id,
      title: tickets.title,
      description: tickets.description,
      status: tickets.status,
      type: tickets.type,

      created_at: tickets.created_at,
      updated_at: tickets.updated_at,
    };

    const allTickets = await db
      .select(body)
      .from(tickets)
      .where(and(eq(tickets.user_id, id), statusCondition))
      .leftJoin(users, eq(users.id, tickets.user_id));

    res.status(200).json({ data: allTickets, type: "success" });
  } catch (err) {
    Logger.error("handle get all tickets", err);
    res
      .status(500)
      .json({ description: "something went wrong", type: "error" });
  }
};

export default handleGetAllTickets;
