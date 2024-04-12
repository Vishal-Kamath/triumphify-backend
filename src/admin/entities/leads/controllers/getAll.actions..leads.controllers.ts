import { db } from "@/lib/db";
import { actions } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { Request, Response } from "express";

const handleGetAllActions = async (req: Request, res: Response) => {
  try {
    const getAllActions = await db.select().from(actions);

    return res.status(200).json({
      data: getAllActions,
      type: "success",
    });
  } catch (err) {
    Logger.error("handle get all action", err);
    res
      .status(500)
      .json({ description: "something went wrong", type: "error" });
  }
};

export default handleGetAllActions;
