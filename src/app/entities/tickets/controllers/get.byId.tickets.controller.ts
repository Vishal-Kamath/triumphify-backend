import { TokenPayload } from "@/app/utils/jwt.utils";
import { db } from "@/lib/db";
import { tickets, users } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

const handleGetTicketById = async (
  req: Request<{ ticketId: string }, {}, TokenPayload>,
  res: Response
) => {
  try {
    const { ticketId } = req.params;

    const body = {
      id: tickets.id,
      title: tickets.title,
      description: tickets.description,
      status: tickets.status,
      type: tickets.type,

      created_at: tickets.created_at,
      updated_at: tickets.updated_at,
    };

    const ticket = (
      await db
        .select(body)
        .from(tickets)
        .where(eq(tickets.id, ticketId))
        .leftJoin(users, eq(users.id, tickets.user_id))
        .limit(1)
    )[0];

    if (!ticket) {
      return res
        .status(404)
        .json({ description: "ticket not found", type: "error" });
    }

    res.status(200).json({ data: ticket, type: "success" });
  } catch (err) {
    Logger.error("handle get ticket by id error", err);
    res
      .status(500)
      .json({ description: "something went wrong", type: "error" });
  }
};

export default handleGetTicketById;
