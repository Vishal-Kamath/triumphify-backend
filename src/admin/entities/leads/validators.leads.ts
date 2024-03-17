import { z } from "zod";

export const updateLead = z.object({
  name: z.string(),
  email: z.string(),
  tel: z.string(),
  assigned: z.string().nullish(),
  source: z.string(),
  status: z.enum(["pending", "converted", "rejected"]),
  last_contacted: z
    .string()
    .refine((val) => !!val && !isNaN(new Date(val).getTime()))
    .nullable(),
});
export type ReqUpdateLead = z.infer<typeof updateLead>;
