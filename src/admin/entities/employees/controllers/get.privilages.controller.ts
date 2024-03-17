import { getRole } from "@/admin/utils/getRole";
import { TokenPayload } from "@/admin/utils/jwt.utils";
import { db } from "@/lib/db";
import { employee_privilages } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { Request, Response } from "express";

const handleGetPrivilages = async (
  req: Request<
    {},
    {},
    {
      path: string;
    } & TokenPayload
  >,
  res: Response
) => {
  try {
    const { role } = req.body.token;
    const { path } = req.body;
    const privilages = (
      await db
        .select()
        .from(employee_privilages)
        .where(
          and(
            eq(employee_privilages.role, getRole(role)),
            eq(employee_privilages.path, path)
          )
        )
        .limit(1)
    )[0];

    if (!privilages) {
      return res.status(403).json({
        data: "denied",
        description: "You don't have access to this resource",
        type: "error",
      });
    }

    return res.status(200).json({
      data: "granted",
      description: "You have access to this resource",
      type: "success",
    });
  } catch (error) {
    return res.status(500).json({ description: "something went wrong" });
  }
};

export default handleGetPrivilages;
