import { Request, Response } from "express";
import { Logger } from "@/utils/logger";
import { db } from "@/lib/db";
import { employee } from "@/lib/db/schema";
import { getRole } from "@admin-old/utils/getRole";

const handleGetEmployees = async (req: Request, res: Response) => {
  try {
    const employees = (
      await db
        .select({
          id: employee.id,
          username: employee.username,
          email: employee.email,
          role: employee.role,
          created_at: employee.created_at,
          updated_at: employee.updated_at,
        })
        .from(employee)
    ).map((emp) => ({
      ...emp,
      role: getRole(emp.role),
    }));

    return res.status(200).send({
      data: employees,
    });
  } catch (err) {
    Logger.error("handle get employees error", err);
    res
      .status(500)
      .json({ description: "internal server error", type: "error" });
  }
};

export default handleGetEmployees;