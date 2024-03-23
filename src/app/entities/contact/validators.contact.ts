import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(3).max(50),
  email: z.string().trim().email().min(1).max(100),
  tel: z
    .string()
    .max(100)
    // .refine((val) => val.toString().length > 9, "Field is required")
    .refine((val) => !Number.isNaN(Number(val)), "Invalid input"),
});

export type ContactType = z.infer<typeof contactSchema>;
