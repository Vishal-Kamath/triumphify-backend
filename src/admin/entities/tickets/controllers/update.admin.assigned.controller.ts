import { TokenPayload } from "@/admin/utils/jwt.utils";
import { db } from "@/lib/db";
import { Logger } from "@/utils/logger";
import { Request, Response } from "express";
import { zAssigned } from "../validators.tickets";
import { DbEmployee, employee, tickets } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { CSVLogger } from "@/utils/csv.logger";
import { getRole } from "@/admin/utils/getRole";

const handleUpdateAssigned = async (
  req: Request<{ ticketId: string }, {}, zAssigned & TokenPayload>,
  res: Response
) => {
  try {
    const { ticketId } = req.params;
    const { id, role } = req.body.token;
    const { assigned } = req.body;

    let findEmployee: DbEmployee | undefined = undefined;
    if (!!assigned) {
      findEmployee = (
        await db
          .select()
          .from(employee)
          .where(eq(employee.id, assigned))
          .limit(1)
      )[0];
      if (!findEmployee) {
        return res
          .status(404)
          .send({ description: "employee not found", type: "error" });
      }
    }

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
      req.body.assigned && findEmployee?.username
        ? `Ticket ${ticketId} assigned to ${findEmployee.username} by ${id}`
        : `Ticket ${ticketId} unassigned by ${id}`
    );

    await db
      .update(tickets)
      .set({
        assigned,
      })
      .where(eq(tickets.id, ticketId));

    res.status(200).json({
      title: "Success",
      description: "Ticket updated successfully",
      type: "success",
    });
  } catch (err) {
    Logger.error("handle update ticket assigned error", err);
    res
      .status(500)
      .json({ description: "something went wrong", type: "error" });
  }
};

export default handleUpdateAssigned;
