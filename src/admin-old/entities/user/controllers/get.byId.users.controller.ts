import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

const handleGetUserById = async (
  req: Request<{ userId: string }>,
  res: Response
) => {
  try {
    const { userId } = req.params;
    const userDetails = (
      await db.select().from(users).where(eq(users.id, userId)).limit(1)
    )[0];

    if (!userDetails) {
      return res.status(404).send({
        description: "user not found",
        type: "error",
      });
    }

    return res.status(200).send({
      data: userDetails,
      type: "success",
    });
  } catch (err) {
    Logger.error("handle get user by id error", err);
    return res.status(500).send({
      description: "something went wrong",
      type: "error",
    });
  }
};

export default handleGetUserById;
