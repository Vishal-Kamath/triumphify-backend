import { status } from "./../../products/validators.products";
import { getRole } from "@/admin/utils/getRole";
import { TokenPayload } from "@/admin/utils/jwt.utils";
import { db } from "@/lib/db";
import { tickets } from "@/lib/db/schema";
import { CSVLogger } from "@/utils/csv.logger";
import { Logger } from "@/utils/logger";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import { zStatus } from "../validators.tickets";

const handleUpdateTicketStatus = async (
  req: Request<{ ticketId: string }, {}, zStatus & TokenPayload>,
  res: Response
) => {
  try {
    const { ticketId } = req.params;
    const { id, role } = req.body.token;
    const { status } = req.body;

    const ticket = (
      await db.select().from(tickets).where(eq(tickets.id, ticketId)).limit(1)
    )[0];

    if (!ticket) {
      return res
        .status(404)
        .json({ description: "ticket not found", type: "error" });
    }

    CSVLogger.info(
      id,
      getRole(role),
      `Ticket ${ticketId} status updated by ${id} to ${status}`
    );

    await db
      .update(tickets)
      .set({
        status,
      })
      .where(eq(tickets.id, ticketId));

    res.status(200).json({
      title: "Success",
      description: "Ticket updated successfully",
      type: "success",
    });
  } catch (err) {
    Logger.error("handle update ticket status error", err);
    res
      .status(500)
      .json({ description: "something went wrong", type: "error" });
  }
};

export default handleUpdateTicketStatus;
