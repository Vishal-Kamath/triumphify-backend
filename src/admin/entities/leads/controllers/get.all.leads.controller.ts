import { getRole } from "@/admin/utils/getRole";
import { TokenPayload } from "@/admin/utils/jwt.utils";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { Logger } from "@/utils/logger";
import { and, eq } from "drizzle-orm";
import { Request, Response } from "express";

interface GetLeadsType {
  id: string;
  name: string;
  email: string;
  tel: string;
  source: string;
  assigned?: string | null;
  status: "new" | "pending" | "converted" | "rejected";
  last_contacted: Date | null;
  created_at: Date;
  updated_at: Date | null;
}

const handleGetAllLeads = async (
  req: Request<
    {},
    {},
    TokenPayload,
    { status?: "new" | "pending" | "converted" | "rejected" }
  >,
  res: Response
) => {
  try {
    const role = getRole(req.body.token.role);
    const status = req.query.status;
    const { id } = req.body.token;

    const statusCondition = status ? eq(leads.status, status) : undefined;
    const allLeads: GetLeadsType[] =
      role === "employee"
        ? await db
            .select({
              id: leads.id,
              name: leads.name,
              email: leads.email,
              tel: leads.tel,
              source: leads.source,
              status: leads.status,
              last_contacted: leads.last_contacted,
              created_at: leads.created_at,
              updated_at: leads.updated_at,
            })
            .from(leads)
            .where(and(eq(leads.assigned, id), statusCondition))
        : await db.select().from(leads).where(statusCondition);

    const leadsData =
      role === "employee"
        ? allLeads
        : allLeads.map((lead) => {
            return {
              ...lead,
              assigned: lead?.assigned === null ? "NA" : lead.assigned,
            };
          });
    res.status(200).json({ data: leadsData, type: "success" });
  } catch (err) {
    Logger.error("handle get all leads", err);
    res
      .status(500)
      .json({ description: "something went wrong", type: "error" });
  }
};

export default handleGetAllLeads;
