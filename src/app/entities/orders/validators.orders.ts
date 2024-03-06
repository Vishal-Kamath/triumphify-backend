import { z } from "zod";

export const placeOrders = z.object({
  billingAddress: z.string().min(36).max(36),
  shippingAddress: z.string().min(36).max(36),
});

export type RequestPlaceOrders = z.infer<typeof placeOrders>;
