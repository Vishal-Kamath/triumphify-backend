import { z } from "zod";

export const address = z.object({
  name: z
    .string()
    .max(100)
    .refine((val) => !!val.trim(), "Field is required"),
  street_address: z
    .string()
    .max(150)
    .refine((val) => !!val.trim(), "Field is required"),
  city: z
    .string()
    .max(100)
    .refine((val) => !!val.trim(), "Field is required"),
  state: z
    .string()
    .max(100)
    .refine((val) => !!val.trim(), "Field is required"),
  zip: z
    .string()
    .max(10)
    .refine((val) => !!val.trim(), "Field is required"),
  country: z
    .string()
    .max(100)
    .refine((val) => !!val.trim(), "Field is required"),
  tel: z
    .string()
    .max(100)
    .refine((val) => val.toString().length > 9, "Field is required")
    .refine((val) => !Number.isNaN(Number(val)), "Invalid input"),
  email: z
    .string()
    .max(100)
    .email()
    .refine((val) => !!val.trim(), "Field is required"),
});

export type RequestAddress = z.infer<typeof address>;
