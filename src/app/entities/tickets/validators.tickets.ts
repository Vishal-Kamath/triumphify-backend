import { z } from "zod";

export const zticket = z.object({
  title: z
    .string()
    .max(100)
    .refine((val) => !!val.trim(), "Field is required"),
  description: z.string().max(750),
});

export type zTicket = z.infer<typeof zticket>;
