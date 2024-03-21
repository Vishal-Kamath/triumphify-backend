import { ticket_chats, tickets } from "@/lib/db/schema";
import { TokenPayload } from "@/admin/utils/jwt.utils";
import { Logger } from "@/utils/logger";
import { Request, Response } from "express";
import { zTicketChat } from "../validators.tickets";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";

const handleChatWithClient = async (
  req: Request<{ ticketId: string }, {}, zTicketChat & TokenPayload>,
  res: Response
) => {
  try {
    const { id } = req.body.token;
    const { ticketId } = req.params;
    const { content } = req.body;

    const findTicket = (
      await db.select().from(tickets).where(eq(tickets.id, ticketId)).limit(1)
    )[0];
    if (!findTicket) {
      return res
        .status(404)
        .json({ description: "ticket not found", type: "error" });
    }

    await db.insert(ticket_chats).values({
      id: uuid(),
      ticket_id: ticketId,
      user_or_employee_id: id,
      content,
      type: "employee",
    });

    res.status(200).send();
  } catch (err) {
    Logger.error("handle chat with client error", err);
    res
      .status(500)
      .json({ description: "something went wrong", type: "error" });
  }
};

export default handleChatWithClient;
