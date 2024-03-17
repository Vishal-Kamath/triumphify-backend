import { db } from "@/lib/db";
import { employee } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

const handleActivateDeactivateEmployee = async (
  req: Request<{ id: string; status: "active" | "deactive" }>,
  res: Response
) => {
  try {
    const { id, status } = req.params;

    const fetchEmployee = (
      await db.select().from(employee).where(eq(employee.id, id)).limit(1)
    )[0];
    if (!fetchEmployee) {
      return res
        .status(404)
        .json({ description: "Employee not found", type: "error" });
    }

    await db.update(employee).set({ status }).where(eq(employee.id, id));

    return res.status(200).json({
      title: "Succes",
      description: `Employee ${fetchEmployee.username} ${status}d successfully`,
      type: "success",
    });
  } catch (err) {
    Logger.error("handle activate deactivate employees error", err);
    res
      .status(500)
      .json({ description: "internal server error", type: "error" });
  }
};

export default handleActivateDeactivateEmployee;
