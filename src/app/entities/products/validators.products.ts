import { z } from "zod";

export const product_review = z.object({
  review_title: z
    .string()
    .max(100)
    .refine((val) => !!val.trim(), "Field is required"),
  review_description: z
    .string()
    .max(750)
    .refine((val) => !!val.trim(), "Field is required"),
  rating: z
    .number()
    .min(1)
    .max(5)
    .refine((val) => !!val, "Field is required"),
});
export const productId = z.object({
  productId: z.string().max(36).min(36).uuid(),
});

export type ReqUserReview = z.infer<typeof product_review>;
