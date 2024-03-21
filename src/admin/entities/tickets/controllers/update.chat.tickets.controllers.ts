import { TokenPayload } from "@/admin/utils/jwt.utils";
import { Logger } from "@/utils/logger";
import { Request, Response } from "express";
import { zTicketChat } from "../validators.tickets";
import { db } from "@/lib/db";
import { ticket_chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { CSVLogger } from "@/utils/csv.logger";
import { getRole } from "@/admin/utils/getRole";

const handleUpdateChatTickets = async (
  req: Request<
    { ticketId: string; chatId: string },
    {},
    zTicketChat & TokenPayload
  >,
  res: Response
) => {
  try {
    const { id, role } = req.body.token;

    const { ticketId, chatId } = req.params;
    const { content } = req.body;

    const findTicketChat = (
      await db
        .select()
        .from(ticket_chats)
        .where(eq(ticket_chats.id, chatId))
        .limit(1)
    )[0];

    if (!findTicketChat) {
      return res
        .status(404)
        .json({ description: "ticket chat not found", type: "error" });
    }

    await db
      .update(ticket_chats)
      .set({
        content,
      })
      .where(eq(ticket_chats.id, chatId));

    CSVLogger.info(
      id,
      getRole(role),
      `employee updated chat with ticket ${ticketId} with content ${content}`
    );
    res
      .status(200)
      .json({ description: "ticket chat updated", type: "success" });
  } catch (err) {
    Logger.error("handle update ticket chats error", err);
    res
      .status(500)
      .json({ description: "something went wrong", type: "error" });
  }
};

export default handleUpdateChatTickets;
