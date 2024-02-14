import { getRole } from "@/admin/utils/getRole";
import { db } from "@/lib/db";
import { employee } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

const handleFetchEmployeeDetailsForAdmin = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const employeedetails = (
      await db.select().from(employee).where(eq(employee.id, id)).limit(1)
    )[0];
    if (!employeedetails) {
      return res
        .status(404)
        .send({ description: "Employee not found", type: "error" });
    }

    return res.status(200).send({
      data: {
        id: employeedetails.id,
        email: employeedetails.email,
        username: employeedetails.username,
        role: getRole(employeedetails.role),
        created_at: employeedetails.created_at,
        updated_at: employeedetails.updated_at,
      },
    });
  } catch (err) {
    Logger.error("handleFetchEmployeeDetailsForAdmin error", err);
    return res
      .status(500)
      .send({ description: "Internal server error", type: "error" });
  }
};

export default handleFetchEmployeeDetailsForAdmin;
