import { TokenPayload } from "@/admin/utils/jwt.utils";
import { db } from "@/lib/db";
import { actions } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import { ReqAction } from "../validators.leads";
import { CSVLogger } from "@/utils/csv.logger";
import { getRole } from "@/admin/utils/getRole";

const handleUpdateAction = async (
  req: Request<{ actionId: string }, {}, ReqAction & TokenPayload>,
  res: Response
) => {
  try {
    const { actionId } = req.params;
    const { title, subject, body } = req.body;
    const { id, role } = req.body.token;

    const findAction = (
      await db.select().from(actions).where(eq(actions.id, actionId)).limit(1)
    )[0];
    if (!findAction) {
      return res.status(400).send({
        description: "Action not found",
        type: "error",
      });
    }

    await db
      .update(actions)
      .set({
        title,
        subject,
        body,
      })
      .where(eq(actions.id, actionId));

    CSVLogger.info(id, getRole(role), "Updated action" + actionId);
    return res.status(200).send({
      title: "Update Successfully",
      description: "Action updated successfully",
      type: "success",
    });
  } catch (err) {
    Logger.error("update action error", err);
    res
      .status(500)
      .send({ description: "something went wrong", tyep: "error" });
  }
};

export default handleUpdateAction;
