import { TokenPayload } from "@/app/utils/jwt.utils";
import { Logger } from "@/utils/logger";
import { Request, Response } from "express";
import { zTicket } from "../validators.tickets";
import { tickets } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { desc, eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";

const handleCreateTicket = async (
  req: Request<{}, {}, zTicket & TokenPayload>,
  res: Response
) => {
  try {
    const { id } = req.body.token;
    const { title, description } = req.body;

    const lastTicketCreatedByUser = (
      await db
        .select({ created_at: tickets.created_at })
        .from(tickets)
        .where(eq(tickets.user_id, id))
        .orderBy((data) => desc(data.created_at))
        .limit(1)
    )[0];

    // allow only one ticket per hour
    if (
      !!lastTicketCreatedByUser &&
      new Date().getTime() -
        new Date(lastTicketCreatedByUser.created_at).getTime() <
        1000 * 60 * 60
    ) {
      return res.status(406).send({
        title: "Not allowed",
        description:
          "To prevent us from being spammed, We only allow users to generate one ticket per hour. Thank you for understanding",
        type: "error",
      });
    }

    await db.insert(tickets).values({
      id: uuid(),
      user_id: id,
      title,
      description,
      status: "pending",
      type: "support",
    });

    res
      .status(201)
      .send({
        title: "Ticket created",
        description: "Our operators will get back to you as soon as possible",
        type: "success",
      });
  } catch (err) {
    Logger.error("handle create ticket error", err);
    res
      .status(500)
      .send({ description: "something went wrong.", type: "error" });
  }
};

export default handleCreateTicket;
