import { getRole } from "@/admin/utils/getRole";
import { TokenPayload } from "@/admin/utils/jwt.utils";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { CSVLogger } from "@/utils/csv.logger";
import { Logger } from "@/utils/logger";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

const handleDeleteLeads = async (
  req: Request<{ leadId: string }, {}, TokenPayload>,
  res: Response
) => {
  try {
    const { id, role } = req.body.token;
    const { leadId } = req.params;

    const findLead = (
      await db.select().from(leads).where(eq(leads.id, leadId)).limit(1)
    )[0];
    if (!findLead) {
      return res
        .status(404)
        .send({ description: "Lead not found", type: "error" });
    }

    await CSVLogger.info(
      id,
      getRole(role),
      "Delete lead",
      findLead.id,
      findLead.email
    );

    await db.delete(leads).where(eq(leads.id, leadId));

    res.status(200).send({
      title: "Lead deleted",
      description: `Lead ${findLead.email} was successfully deleted`,
      type: "success",
    });
  } catch (err) {
    Logger.error("Delete leads error", err);
    res
      .status(500)
      .send({ description: "something went wrong", tyep: "error" });
  }
};

export default handleDeleteLeads;
