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
    const role = getRole(req.body.token.role);
    const status = req.query.status;
    const { id } = req.body.token;

    const statusCondition = status ? eq(tickets.status, status) : undefined;
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

    const allTickets: GetTicketsType[] =
      role === "employee"
        ? await db
            .select(body)
            .from(tickets)
            .where(and(eq(tickets.assigned, id), statusCondition))
            .leftJoin(users, eq(users.id, tickets.user_id))
        : await db
            .select({
              ...body,
              assigned: tickets.assigned,
            })
            .from(tickets)
            .where(statusCondition)
            .leftJoin(users, eq(users.id, tickets.user_id));

    const ticketsData =
      role === "employee"
        ? allTickets
        : allTickets.map((ticket) => {
            return {
              ...ticket,
              assigned: ticket?.assigned === null ? "NA" : ticket.assigned,
            };
          });
    res.status(200).json({ data: ticketsData, type: "success" });
  } catch (err) {
    Logger.error("handle get all tickets", err);
    res
      .status(500)
      .json({ description: "something went wrong", type: "error" });
  }
};

export default handleGetAllTickets;
