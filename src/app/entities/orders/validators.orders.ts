import { z } from "zod";

export const placeOrders = z.object({
  billingAddress: z.string().min(36).max(36),
  shippingAddress: z.string().min(36).max(36),
});

export type RequestPlaceOrders = z.infer<typeof placeOrders>;

export const requestCancelReturn = z.object({
  reason: z
    .string()
    .max(750)
    .refine((val) => !!val.trim(), "Field is required"),
});

export type RequestCancelReturn = z.infer<typeof requestCancelReturn>;