import { z } from "zod";

export const updateLead = z.object({
  name: z.string(),
  email: z.string(),
  tel: z.string(),
  assigned: z.string().nullable(),
  source: z.string(),
  status: z.enum(["pending", "converted", "rejected"]),
  last_contacted: z.date().nullable(),
});
export type ReqUpdateLead = z.infer<typeof updateLead>;
