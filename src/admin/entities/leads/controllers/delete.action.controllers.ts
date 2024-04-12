import { getRole } from "@/admin/utils/getRole";
import { TokenPayload } from "@/admin/utils/jwt.utils";
import { db } from "@/lib/db";
import { action_logs, actions } from "@/lib/db/schema";
import { CSVLogger } from "@/utils/csv.logger";
import { Logger } from "@/utils/logger";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

const handleDeleteAction = async (
  req: Request<{ actionId: string }, {}, TokenPayload>,
  res: Response
) => {
  try {
    const { actionId } = req.params;
    const { id, role } = req.body.token;

    const findAction = (
      await db.select().from(actions).where(eq(actions.id, actionId)).limit(1)
    )[0];
    if (!findAction) {
      return res
        .status(404)
        .send({ description: "Action not found", type: "error" });
    }

    await db.delete(action_logs).where(eq(action_logs.action_id, actionId));
    await db.delete(actions).where(eq(actions.id, actionId));

    await CSVLogger.info(
      id,
      getRole(role),
      "Delete action",
      findAction.id,
      findAction.title
    );

    res.status(200).send({
      title: "Action deleted",
      description: `Action "${findAction.title}" was successfully deleted`,
      type: "success",
    });
  } catch (err) {
    Logger.error("Delete action error", err);
    res
      .status(500)
      .send({ description: "something went wrong", tyep: "error" });
  }
};

export default handleDeleteAction;
