import { Request, Response } from "express";
import { Logger } from "@/utils/logger";
import { db } from "@/lib/db";
import { employee } from "@/lib/db/schema";
import { getRole } from "@admin/utils/getRole";
import { and, eq, ne } from "drizzle-orm";
import { env } from "@/config/env.config";
import { TokenPayload } from "@/admin/utils/jwt.utils";

const handleGetEmployees = async (
  req: Request<{}, {}, TokenPayload>,
  res: Response
) => {
  try {
    const role = getRole(req.body.token.role);

    const employees = (
      role === "superadmin"
        ? await db
            .select({
              id: employee.id,
              username: employee.username,
              email: employee.email,
              role: employee.role,
              rate: employee.rate,
              status: employee.status,
              created_at: employee.created_at,
              updated_at: employee.updated_at,
            })
            .from(employee)
            .where(ne(employee.role, env.SUPERADMIN))
        : await db
            .select({
              id: employee.id,
              username: employee.username,
              email: employee.email,
              role: employee.role,
              created_at: employee.created_at,
              updated_at: employee.updated_at,
            })
            .from(employee)
            .where(
              and(
                eq(employee.role, env.EMPLOYEE),
                eq(employee.status, "active")
              )
            )
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
