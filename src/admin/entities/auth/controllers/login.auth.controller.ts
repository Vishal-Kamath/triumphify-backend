import { Request, Response } from "express";
import { Logger } from "@/utils/logger";
import { ReqLogin } from "../validators.auth";
import { db } from "@/lib/db";
import { employee } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

const handleLogin = async (req: Request<{}, {}, ReqLogin>, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = (
      await db
        .select()
        .from(employee)
        .where(eq(employee.username, username))
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

    return res.status(200).send({
      title: "Logged In!!",
      description: `successfully logged in as ${user.username}`,
      type: "success",
    });
  } catch (err) {
    Logger.error("handle Login error", err);
    return res
      .status(500)
      .send({ message: "Internal server error", type: "error" });
  }
};

export default handleLogin;
