import { z } from "zod";

export const updateLead = z.object({
  name: z.string(),
  email: z.string(),
  tel: z.string(),
  assigned: z.string().nullish(),
  source: z.string(),
  status: z.enum(["new", "pending", "converted", "rejected"]),
  last_contacted: z
    .string()
    .refine((val) => !!val && !isNaN(new Date(val).getTime()))
    .nullable(),
});
export type ReqUpdateLead = z.infer<typeof updateLead>;

export const triggerAction = z.object({
  action: z.string(),

  title: z
    .string()
    .max(100)
    .refine((value) => !!value.trim(), "Field Required"),
  subject: z
    .string()
    .max(100)
    .refine((value) => !!value.trim(), "Field Required"),
  body: z.string().refine((value) => !!value.trim(), "Field Required"),

  receivers: z
    .object({
      userName: z.string(),
      email: z.string().email(),
    })
    .array()
    .min(1),
});
export type ReqTriggerAction = z.infer<typeof triggerAction>;