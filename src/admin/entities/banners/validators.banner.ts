import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1080 * 1080;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const urlRegex =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

export const banner = z.object({
  banner_image_desktop: z
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

  banner_image_mobile: z
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

  link: z
    .string()
    .max(350)
    .refine((val) => val.trim(), "Field required"),
  is_published: z.boolean(),
});

export type Banner = z.infer<typeof banner>;

export const updateBanner = z.object({
  banner_image_desktop: z
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
  banner_image_mobile: z
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

  link: z
    .string()
    .max(350)
    .refine((val) => val.trim(), "Field required"),
  is_published: z.boolean(),
});

export type UpdateBanner = z.infer<typeof updateBanner>;
