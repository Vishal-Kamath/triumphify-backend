import { Logger } from "@/utils/logger";
import { Request, Response } from "express";
import { ReqTriggerAction } from "../validators.leads";
import { TokenPayload } from "@/admin/utils/jwt.utils";
import { triggerAction } from "@/utils/courier/trigger-action";
import { db } from "@/lib/db";
import { action_logs, actions } from "@/lib/db/schema";
import { v4 as uuid } from "uuid";
import { eq } from "drizzle-orm";
import { CSVLogger } from "@/utils/csv.logger";
import { getRole } from "@/admin/utils/getRole";

const handleTriggerAction = async (
  req: Request<{}, {}, ReqTriggerAction & TokenPayload>,
  res: Response
) => {
  try {
    const { title, action, body, receivers, subject, token } = req.body;
    const { id, role } = token;

    if (action === "new") {
      const actionId = uuid();
      await db.insert(actions).values({
        id: actionId,
        title,
        subject,
        body,
      });

      triggerAction({
        receivers,
        data: {
          subject,
          body,
        },
      });

      const log_id = uuid();
      await db.insert(action_logs).values({
        id: log_id,
        action_id: actionId,
        triggered_by: id,
        title,
        subject,
        body,
        receivers,
      });
      CSVLogger.info(
        id,
        getRole(role),
        "triggered action with log id",
        log_id,
        "and action id",
        actionId
      );
    } else {
      const getaction = (
        await db.select().from(actions).where(eq(actions.id, action)).limit(1)
      )[0];
      if (!getaction) {
        return res.status(400).json({
          description: "Action not found",
          type: "error",
        });
      }

      triggerAction({
        receivers,
        data: {
          subject: getaction.subject,
          body: getaction.body,
        },
      });

      const log_id = uuid();
      await db.insert(action_logs).values({
        id: log_id,
        action_id: getaction.id,
        triggered_by: id,
        title: getaction.title,
        subject: getaction.subject,
        body: getaction.body,
        receivers,
      });
      CSVLogger.info(
        id,
        getRole(role),
        "triggered action with log id",
        log_id,
        "and action id",
        getaction.id
      );
    }

    res.status(200).json({ title: "Action triggered", type: "success" });
  } catch (err) {
    Logger.error("handle trigger action", err);
    res
      .status(500)
      .json({ description: "something went wrong", type: "error" });
  }
};

export default handleTriggerAction;
