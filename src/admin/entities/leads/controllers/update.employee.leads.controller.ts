import { Logger } from "@/utils/logger";
import { Request, Response } from "express";
import { ReqUpdateLead } from "../validators.leads";
import { db } from "@/lib/db";
import { DbEmployee, employee, leads } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { CSVLogger } from "@/utils/csv.logger";
import { TokenPayload } from "@/admin/utils/jwt.utils";
import { getRole } from "@/admin/utils/getRole";

const handleUpdateLeadEmployee = async (
  req: Request<{ leadId: string }, {}, ReqUpdateLead & TokenPayload>,
  res: Response
) => {
  try {
    const { id, role } = req.body.token;
    const { leadId } = req.params;
    const { name, email, last_contacted, source, status, tel } = req.body;

    const lead = (
      await db.select().from(leads).where(eq(leads.id, leadId)).limit(1)
    )[0];
    if (!lead) {
      return res
        .status(404)
        .send({ description: "lead not found", type: "error" });
    }

    CSVLogger.info(id, getRole(role), `employee updated lead ${lead.id}`);

    await db
      .update(leads)
      .set({
        name,
        email,
        last_contacted: last_contacted ? new Date(last_contacted) : null,
        source,
        status,
        tel,
      })
      .where(eq(leads.id, leadId));

    res.status(200).send({
      title: "Success",
      description: "Lead updated successfully",
      type: "success",
    });
  } catch (err) {
    Logger.error("handle update lead", err);
    res
      .status(500)
      .send({ description: "something went wrong", type: "error" });
  }
};

export default handleUpdateLeadEmployee;
