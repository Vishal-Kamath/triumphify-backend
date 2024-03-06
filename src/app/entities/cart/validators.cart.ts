import { z } from "zod";

export const addToCart = z.object({
  productId: z.string(),
  variationId: z.string(),
});

export type AddToCartRequest = z.infer<typeof addToCart>;

export const quantity = z.object({
  quantity: z.number().min(1),
});
