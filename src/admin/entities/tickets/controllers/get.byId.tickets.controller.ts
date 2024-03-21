import { getRole } from "@/admin/utils/getRole";
import { TokenPayload } from "@/admin/utils/jwt.utils";
import { db } from "@/lib/db";
import { tickets, users } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { and, eq } from "drizzle-orm";
import { Request, Response } from "express";

interface GetTicketsType {
  id: string;
  assigned?: string | null;
  link: string | null;
  user_id: string;
  title: string;
  description: string | null;
  status: "pending" | "completed" | "failed";
  type: "order" | "support" | "request" | "misc";
  created_at: Date;
  updated_at: Date | null;
}

const handleGetTicketById = async (
  req: Request<{ ticketId: string }, {}, TokenPayload>,
  res: Response
) => {
  try {
    const { ticketId } = req.params;
    const role = getRole(req.body.token.role);
    const { id } = req.body.token;

    const body = {
      id: tickets.id,
      link: tickets.link,

      user_id: tickets.user_id,
      user_username: users.username,
      user_image: users.image,

      title: tickets.title,
      description: tickets.description,
      status: tickets.status,
      type: tickets.type,

      created_at: tickets.created_at,
      updated_at: tickets.updated_at,
    };

    const ticket: GetTicketsType = (
      role === "employee"
        ? await db
            .select(body)
            .from(tickets)
            .where(and(eq(tickets.assigned, id), eq(tickets.id, ticketId)))
            .leftJoin(users, eq(users.id, tickets.user_id))
            .limit(1)
        : await db
            .select({
              ...body,
              assigned: tickets.assigned,
            })
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
