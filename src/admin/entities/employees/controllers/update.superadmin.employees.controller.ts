import { TokenPayload } from "@/admin/utils/jwt.utils";
import { db } from "@/lib/db";
import { employee } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import { EmployeeRole } from "../validators.employees";
import { getRoleEnv } from "@/admin/utils/getRole";

const handleUpdateRole = async (
  req: Request<{ id: string }, {}, EmployeeRole & TokenPayload>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    await db
      .update(employee)
      .set({ role: getRoleEnv(role) })
      .where(eq(employee.id, id));

    return res.status(200).send({
      title: "Success",
      description: "Role updated successfully",
      type: "success",
    });
  } catch (err) {
    Logger.error("handle update role error", err);
    res
      .status(500)
      .json({ description: "something went wrong", type: "error" });
  }
};

export default handleUpdateRole;
