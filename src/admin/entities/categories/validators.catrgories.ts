import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1080 * 1080;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const category = z.object({
  name: z.string().max(100),
  description: z.string().max(500),
  category_image: z
    .object({
      name: z.string(),
      size: z.number(),
      type: z.string(),
      lastModified: z.number(),
      base64: z.string(),
    })
    .refine((value) => value.size < MAX_FILE_SIZE, "File size is too large")
    .refine(
      (value) => ACCEPTED_IMAGE_TYPES.includes(value.type),
      "Invalid file type"
    ),
  meta_title: z.string().max(100),
  meta_description: z.string().max(100),
  meta_keywords: z.string().max(100),
});
export type CategoryType = z.infer<typeof category>;

export const categoryUpdate = z.object({
  name: z.string().max(100),
  description: z.string().max(500),
  category_image: z
    .object({
      name: z.string(),
      size: z.number(),
      type: z.string(),
      lastModified: z.number(),
      base64: z.string(),
    })
    .refine((value) => value.size < MAX_FILE_SIZE, "File size is too large")
    .refine(
      (value) => ACCEPTED_IMAGE_TYPES.includes(value.type),
      "Invalid file type"
    )
    .or(z.string()),
  meta_title: z.string().max(100),
  meta_description: z.string().max(100),
  meta_keywords: z.string().max(100),
});
export type ReqUpdateCategory = z.infer<typeof categoryUpdate>;