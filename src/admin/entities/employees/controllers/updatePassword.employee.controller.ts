import { Logger } from "@/utils/logger";
import { Request, Response } from "express";
import { EmployeePassword } from "../validators.employees";
import { TokenPayload } from "@/admin/utils/jwt.utils";
import { db } from "@/lib/db";
import { employee } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { CSVLogger } from "@/utils/csv.logger";
import { getRole } from "@/admin/utils/getRole";

const handleUpdateEmployeePassword = async (
  req: Request<{}, {}, EmployeePassword & TokenPayload>,
  res: Response
) => {
  try {
    const { id } = req.body.token;
    const { newPassword, currentPassword } = req.body;

    const findEmployee = (
      await db.select().from(employee).where(eq(employee.id, id)).limit(1)
    )[0];
    if (!findEmployee) {
      return res
        .status(404)
        .send({ description: "Employee not found", type: "error" });
    }

    const checkPassword = await bcrypt.compare(
      currentPassword,
      findEmployee.password
    );
    if (!checkPassword) {
      return res.status(400).send({
        title: "Error",
        description: "Incorrect Password",
        type: "error",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db
      .update(employee)
      .set({ password: hashedPassword })
      .where(eq(employee.id, id));

    CSVLogger.succes(
      findEmployee.id,
      getRole(findEmployee.role),
      "update password"
    );
    return res.status(200).send({
      title: "Password update",
      description: "new password saved successfully",
      type: "success",
    });
  } catch (err) {
    Logger.error("handle update employee password error", err);
    res
      .status(500)
      .json({ description: "internal server error", type: "error" });
  }
};

export default handleUpdateEmployeePassword;
