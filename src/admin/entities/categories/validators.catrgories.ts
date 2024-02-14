import { z } from "zod";

export const category = z.object({
  name: z.string().max(100),
  description: z.string().max(500),
  category_image: z.object({
    name: z.string(),
    size: z.number(),
    type: z.string(),
    lastModified: z.number(),
    base64: z.string(),
  }),
  meta_title: z.string().max(100),
  meta_description: z.string().max(100),
  meta_keywords: z.string().max(100),
});
export type CategoryType = z.infer<typeof category>;
