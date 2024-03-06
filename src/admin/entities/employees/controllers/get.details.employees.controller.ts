import { eq } from "drizzle-orm";
import { employee } from "@/lib/db/schema";
import { TokenPayload } from "@admin/utils/jwt.utils";
import { Logger } from "@/utils/logger";
import { Request, Response } from "express";
import { db } from "@/lib/db";
import { getRole } from "@admin/utils/getRole";

const handleGetEmployeeDetails = async (
  req: Request<{}, {}, TokenPayload>,
  res: Response
) => {
  try {
    const employeedetails = (
      await db
        .select()
        .from(employee)
        .where(eq(employee.id, req.body.token.id))
        .limit(1)
    )[0];

    if (!employeedetails) {
      return res
        .status(404)
        .send({ description: "Employee not found", type: "error" });
    }

    return res.status(200).send({
      data: {
        id: employeedetails.id,
        username: employeedetails.username,
        email: employeedetails.email,
        role: getRole(employeedetails.role),
        status: employeedetails.status,
        created_at: employeedetails.created_at,
        updated_at: employeedetails.updated_at,
      },
      type: "success",
    });
  } catch (err) {
    Logger.error("handle GetEmployeeDetails error", err);
    return res
      .status(500)
      .send({ description: "Internal server error", type: "error" });
  }
};

export default handleGetEmployeeDetails;
