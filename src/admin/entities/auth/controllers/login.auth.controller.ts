import { Request, Response } from "express";
import { Logger } from "@/utils/logger";
import { ReqLogin } from "../validators.auth";
import { db } from "@/lib/db";
import { employee } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { addTokens } from "../utils/auth";
import { CSVLogger } from "@/utils/csv.logger";
import { getRole } from "@/admin/utils/getRole";
import { env } from "@/config/env.config";

const handleLogin = async (req: Request<{}, {}, ReqLogin>, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = (
      await db
        .select()
        .from(employee)
        .where(and(eq(employee.email, email), eq(employee.status, "active")))
        .limit(1)
    )[0];
    if (!user) {
      return res
        .status(404)
        .send({ description: "User not found", type: "error" });
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res
        .status(400)
        .send({ description: "Incorrect password", type: "error" });
    }

    addTokens(res, user.id, user.role);
    CSVLogger.info(
      user.id,
      getRole(user.role),
      `User ${user.username} logged in`
    );

    return res.status(200).send({
      title: "Logged In!!",
      description: `successfully logged in as ${user.username}`,
      redirect: getRole(user.role) === "superadmin" ? "/analytics" : "/",
      type: "success",
    });
  } catch (err) {
    Logger.error("handle Login error", err);
    return res
      .status(500)
      .send({ description: "Internal server error", type: "error" });
  }
};

export default handleLogin;
