import { getRole } from "@/admin/utils/getRole";
import { TokenPayload } from "@/admin/utils/jwt.utils";
import { db } from "@/lib/db";
import { ticket_chats } from "@/lib/db/schema";
import { CSVLogger } from "@/utils/csv.logger";
import { Logger } from "@/utils/logger";
import { and, eq } from "drizzle-orm";
import { Request, Response } from "express";

const handleDeleteChatTickets = async (
  req: Request<{ ticketId: string; chatId: string }, {}, TokenPayload>,
  res: Response
) => {
  try {
    const { ticketId, chatId } = req.params;
    const { id, role } = req.body.token;

    const findTicket = (
      await db
        .select()
        .from(ticket_chats)
        .where(eq(ticket_chats.id, chatId))
        .limit(1)
    )[0];
    if (!findTicket) {
      return res
        .status(404)
        .json({ description: "chat not found", type: "error" });
    }

    await db
      .delete(ticket_chats)
      .where(
        and(eq(ticket_chats.ticket_id, ticketId), eq(ticket_chats.id, chatId))
      );

    CSVLogger.info(
      id,
      getRole(role),
      `employee deleted chat with ticket ${ticketId} with content ${findTicket.content}`
    );

    res.status(200).send({
      description: "chat deleted",
      type: "success",
    });
  } catch (err) {
    Logger.error("handle chat with client error", err);
    res
      .status(500)
      .json({ description: "something went wrong", type: "error" });
  }
};

export default handleDeleteChatTickets;
