import { status } from "./../products/validators.products";
import { z } from "zod";

export const orderStatus = z.object({
  status: z.enum([
    "pending",
    "confirmed",
    "out for delivery",
    "delivered",
    "return approved",
    "out for pickup",
    "picked up",
    "refunded",
  ]),
});

export type OrderStatus = z.infer<typeof orderStatus>;
