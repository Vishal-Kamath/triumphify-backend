import { Request, Response } from "express";
import { Logger } from "@/utils/logger";
import { LoginType } from "../validators.user";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { addTokens } from "../utils/auth";

const handleLogin = async (req: Request<{}, {}, LoginType>, res: Response) => {
  try {
    const { email, password } = req.body;

    // fetch User
    const user = (
      await db.select().from(users).where(eq(users.email, email)).limit(1)
    )[0];

    if (!user) {
      return res.status(404).send({
        title: "Error",
        description: "User email not found",
        type: "error",
      });
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(400).send({
        title: "Error",
        description: "Incorrect Password",
        type: "error",
      });
    }

    // add tokens
    addTokens(res, user.id);
    return res.status(200).send({
      title: "Success",
      description: `logged in as ${user.username}`,
      type: "success",
    });
  } catch (err) {
    Logger.error("handle login error", err);
    res.status(500).json({ title: "Internal server error", type: "error" });
  }
};

export default handleLogin;
