import { Logger } from "@/utils/logger";
import { Request, Response } from "express";
import { zTicketChat } from "../validators.tickets";
import { TokenPayload } from "@/admin/utils/jwt.utils";
import { db } from "@/lib/db";
import { employee, ticket_chats, users } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

const handleGetTicketChats = async (
  req: Request<{ ticketId: string }, {}, zTicketChat & TokenPayload>,
  res: Response
) => {
  try {
    const { ticketId } = req.params;
    const { role } = req.body.token;
    const chats = await db
      .select({
        id: ticket_chats.id,
        content: ticket_chats.content,
        type: ticket_chats.type,
        created_at: ticket_chats.created_at,
        user_or_employee_id: ticket_chats.user_or_employee_id,
        user: users.username,
        employee: employee.username,
        seen: ticket_chats.seen,
      })
      .from(ticket_chats)
      .where(eq(ticket_chats.ticket_id, ticketId))
      .leftJoin(users, eq(users.id, ticket_chats.user_or_employee_id))
      .leftJoin(employee, eq(employee.id, ticket_chats.user_or_employee_id))
      .orderBy(desc(ticket_chats.created_at));

    chats.forEach((chat) => {
      if (chat.type === "employee") {
        chat.user_or_employee_id = "";
        chat.employee = "Operator";
      }
    });

    res.status(200).json({ data: chats, type: "success" });
  } catch (err) {
    Logger.error("handle get ticket chats error", err);
    res
      .status(500)
      .json({ description: "something went wrong", type: "error" });
  }
};

export default handleGetTicketChats;
