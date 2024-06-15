import { z } from "zod";

// Validator for BlogText
export const blogValidator = z.object({
  title: z.string().min(1).max(255),
  image: z.string().min(1),
  blog: z
    .object({
      blogId: z.string(),
      id: z.string(),
      type: z.enum(["image", "title", "h1", "h2", "text"]),
      order: z.number(),
      content: z.any(),
    })
    .array(),
});

export type ReqBlog = z.infer<typeof blogValidator>;
