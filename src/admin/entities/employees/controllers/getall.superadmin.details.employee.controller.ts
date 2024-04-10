import { getRole, getRoleEnv } from "@/admin/utils/getRole";
import { db } from "@/lib/db";
import { employee } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

const handleGetAllSuperadminDetails = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const superadmins = await db
      .select()
      .from(employee)
      .where(eq(employee.role, getRoleEnv("superadmin")));

    return res.status(200).send({
      data: superadmins.map((superadmin) => ({
        id: superadmin.id,
        email: superadmin.email,
        username: superadmin.username,
        role: getRole(superadmin.role),
        status: superadmin.status,
        created_at: superadmin.created_at,
        updated_at: superadmin.updated_at,
      })),
    });
  } catch (err) {
    Logger.error("handleGetAllSuperadminDetails error", err);
    return res
      .status(500)
      .send({ description: "Internal server error", type: "error" });
  }
};

export default handleGetAllSuperadminDetails;
