import { Logger } from "@/utils/logger";
import { Request, Response } from "express";
import { ReqTriggerAction } from "../validators.leads";
import { TokenPayload } from "@/admin/utils/jwt.utils";
import { triggerAction } from "@/utils/courier/trigger-action";
import { db } from "@/lib/db";
import { action_logs, actions } from "@/lib/db/schema";
import { v4 as uuid } from "uuid";
import { eq } from "drizzle-orm";

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

      await db.insert(action_logs).values({
        id: uuid(),
        action_id: actionId,
        title,
        subject,
        body,
        receivers,
      });
    } else {
      const action = (
        await db.select().from(actions).where(eq(actions.id, actions)).limit(1)
      )[0];
      if (!action) {
        return res.status(400).json({
          description: "Action not found",
          type: "error",
        });
      }

      triggerAction({
        receivers,
        data: {
          subject: action.subject,
          body: action.body,
        },
      });

      await db.insert(action_logs).values({
        id: uuid(),
        action_id: action.id,
        title: action.title,
        subject: action.subject,
        body: action.body,
        receivers,
      });
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
