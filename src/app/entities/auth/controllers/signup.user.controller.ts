import { Request, Response } from "express";
import { Logger } from "@/utils/logger";
import { SignupType } from "../validators.user";
import { db } from "@/lib/db";
import { leads, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { addTokens } from "../utils/auth";
import { welcomeToTriumphifyCourier } from "@/utils/courier/welcome";

const handleSignUp = async (
  req: Request<{}, {}, SignupType>,
  res: Response
) => {
  try {
    const { username, email, tel, password } = req.body;

    // user email exists
    const userExists = (
      await db.select().from(users).where(eq(users.email, email)).limit(1)
    )[0];
    if (userExists) {
      return res.status(400).json({
        title: "ERROR",
        description: "User email already exists",
        type: "error",
      });
    }

    const id = uuid();
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await db.insert(users).values({
      id,
      email,
      tel,
      username,
      password: hashedPassword,
    });

    await db.insert(leads).values({
      id: uuid(),
      name: username,
      email: email,
      source: "website",
      status: "pending",
      tel,
    });

    // TODO: send email verification
    await welcomeToTriumphifyCourier({
      email,
      data: {
        userName: username,
      },
    });

    addTokens(res, id);
    return res.status(201).json({
      title: "User created successfully!!",
      description: "Be sure to verify your email",
      type: "success",
    });
  } catch (err) {
    Logger.error("handle Sign up error", err);
    res.status(500).json({ title: "Internal server error", type: "error" });
  }
};

export default handleSignUp;
