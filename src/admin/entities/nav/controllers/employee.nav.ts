import { TokenPayload } from "@/admin/utils/jwt.utils";
import { db } from "@/lib/db";
import { leads, orders, tickets } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { and, eq, sum } from "drizzle-orm";
import { Request, Response } from "express";

const handleNavEmployee = async (
  req: Request<{}, {}, TokenPayload>,
  res: Response
) => {
  try {
    const { id, role } = req.body.token;
    const { leadsCount } = (
      await db
        .select({ leadsCount: sum(leads.status) })
        .from(leads)
        .where(and(eq(leads.assigned, id), eq(leads.status, "new")))
    )[0];

    const { ordersCount } = (
      await db
        .select({ ordersCount: sum(orders.status) })
        .from(orders)
        .where(and(eq(orders.status, "pending"), eq(orders.cancelled, false)))
    )[0];

    const { ticketsCount } = (
      await db
        .select({ ticketsCount: sum(tickets.status) })
        .from(tickets)
        .where(and(eq(tickets.assigned, id), eq(tickets.status, "pending")))
    )[0];

    const data = {
      leads: leadsCount,
      orders: ordersCount,
      tickets: ticketsCount,
    };
    res.status(200).send({ data, type: "success" });
  } catch (err) {
    Logger.error(err);
    res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};

export default handleNavEmployee;
