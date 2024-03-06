import { Logger } from "@/utils/logger";
import { Request, Response } from "express";
import { Employeedetails } from "../validators.employees";
import { TokenPayload } from "@/admin/utils/jwt.utils";
import { db } from "@/lib/db";
import { employee } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { CSVLogger } from "@/utils/csv.logger";
import { getRole } from "@/admin/utils/getRole";

const handleUpdateEmployee = async (
  req: Request<{}, {}, Employeedetails & TokenPayload>,
  res: Response
) => {
  try {
    const { id } = req.body.token;
    const { username, email } = req.body;

    const findEmployee = (
      await db.select().from(employee).where(eq(employee.id, id)).limit(1)
    )[0];
    if (!findEmployee) {
      return res
        .status(404)
        .send({ description: "Employee not found", type: "error" });
    }

    await db
      .update(employee)
      .set({ username, email })
      .where(eq(employee.id, id));

    CSVLogger.succes(
      findEmployee.id,
      getRole(findEmployee.role),
      "update profile"
    );
    return res.status(200).send({
      title: "Success",
      description: "Employee updated successfully",
      type: "success",
    });
  } catch (err) {
    Logger.error("handle update employee error", err);
    res
      .status(500)
      .json({ description: "internal server error", type: "error" });
  }
};

export default handleUpdateEmployee;
