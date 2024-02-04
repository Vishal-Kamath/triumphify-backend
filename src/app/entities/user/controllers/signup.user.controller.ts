import { Request, Response } from "express";
import { Logger } from "@/utils/logger";
import { SignupType } from "../validators.user";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { addTokens } from "../utils/auth";

const handleSignUp = async (
  req: Request<{}, {}, SignupType>,
  res: Response
) => {
  try {
    const { username, email, dateOfBirth, gender, password } = req.body;

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
      username,
      dateOfBirth,
      gender,
      password: hashedPassword,
    });

    addTokens(res, id);
    return res.status(201).json({
      title: "User created successfully",
      description: "Check your inbox to confirm email",
      type: "success",
    });
  } catch (err) {
    Logger.error("handle Sign up error", err);
    res.status(500).json({ title: "Internal server error", type: "error" });
  }
};

export default handleSignUp;
