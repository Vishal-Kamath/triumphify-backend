import { TokenPayload } from "@/admin/utils/jwt.utils";
import { db } from "@/lib/db";
import { action_logs, actions } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

const handleGetByIdAction = async (
  req: Request<{ actionId: string }, {}, TokenPayload>,
  res: Response
) => {
  try {
    const { actionId } = req.params;

    const findAction = (
      await db.select().from(actions).where(eq(actions.id, actionId)).limit(1)
    )[0];
    if (!findAction) {
      return res.status(400).send({
        description: "Action not found",
        type: "error",
      });
    }

    const allActionLogs = await db
      .select()
      .from(action_logs)
      .where(eq(action_logs.action_id, actionId));

    return res.status(200).send({
      data: {
        action: findAction,
        logs: allActionLogs,
      },
      type: "success",
    });
  } catch (err) {
    Logger.error("get byid action error", err);
    res
      .status(500)
      .send({ description: "something went wrong", tyep: "error" });
  }
};

export default handleGetByIdAction;
