import { Logger } from "@/utils/logger";
import e, { Request, Response } from "express";
import { ReqRateType } from "../validators.employees";
import { TokenPayload } from "@/admin/utils/jwt.utils";
import { db } from "@/lib/db";
import { employee } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { CSVLogger } from "@/utils/csv.logger";
import { getRole } from "@/admin/utils/getRole";

const handleEmployeeRateUpdateBySuperAdmin = async (
  req: Request<{ id: string }, {}, ReqRateType & TokenPayload>,
  res: Response
) => {
  try {
    const { id: employeeId } = req.params;
    const { rate, token } = req.body;
    const { id, role } = token;

    const findEmployee = (
      await db
        .select()
        .from(employee)
        .where(eq(employee.id, employeeId))
        .limit(1)
    )[0];

    if (!findEmployee) {
      return res.status(404).send({
        description: "Employee not found",
        type: "error",
      });
    }

    await db.update(employee).set({ rate }).where(eq(employee.id, employeeId));

    await CSVLogger.info(
      id,
      getRole(role),
      `Updated employee ${employeeId} rate to $${rate}/hr`
    );
    return res.status(200).send({
      title: "Success",
      description: "Employee rate updated successfully",
      type: "success",
    });
  } catch (err) {
    Logger.error("handle employe rate update by superadmin error", err);
    return res
      .status(500)
      .send({ description: "Internal server error", type: "error" });
  }
};

export default handleEmployeeRateUpdateBySuperAdmin;
