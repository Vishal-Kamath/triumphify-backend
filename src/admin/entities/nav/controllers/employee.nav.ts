import { TokenPayload } from "@/admin/utils/jwt.utils";
import { db } from "@/lib/db";
import { leads, orders } from "@/lib/db/schema";
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
        .where(eq(orders.status, "pending"))
    )[0];

    const data = { leads: leadsCount, orders: ordersCount };
    res.status(200).send({ data, type: "success" });
  } catch (err) {
    Logger.error(err);
    res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};

export default handleNavEmployee;
