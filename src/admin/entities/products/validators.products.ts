import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1080 * 1080;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const product = z.object({
  name: z.string().trim().max(100),
  brand_name: z.string().trim().max(100),
  category_id: z.string().refine((data) => !!data.trim(), "Field is required"),

  gst_price: z.number(),
  description: z.string().max(750),
  // description
  product_accordians: z.array(
    z.object({
      title: z.string().trim().max(100),
      description: z.string().trim().max(500),
    })
  ),

  // images
  product_images: z.array(
    z
      .object({
        name: z.string(),
        size: z.number(),
        type: z.string(),
        lastModified: z.number(),
      })
      .refine((value) => value.size < MAX_FILE_SIZE, "File size is too large")
      .refine(
        (value) => ACCEPTED_IMAGE_TYPES.includes(value.type),
        "Invalid file type"
      )
  ),

  // variations
  attributes: z.array(
    z.object({
      key: z.string(),
      parent: z.string(),
      value: z.string(),
    })
  ),
  variations: z.array(
    z.object({
      key: z.string(),
      combinations: z.record(z.string(), z.string()),
      quantity: z.number(),
      discount: z.number(),
      price: z.number(),
    })
  ),

  // meta data
  meta_title: z.string().trim().max(100),
  meta_description: z.string().trim().max(250),
  meta_keywords: z.string().trim().max(100),
});

export type ReqProduct = z.infer<typeof product>;

export const updateProduct = z.object({
  name: z.string().trim().max(100),
  brand_name: z.string().trim().max(100),
  category_id: z.string().refine((data) => !!data.trim(), "Field is required"),

  gst_price: z.number(),
  description: z.string().max(750),
  // description
  product_accordians: z.array(
    z.object({
      title: z.string().trim().max(100),
      description: z.string().trim().max(500),
    })
  ),

  // images
  product_images: z.array(
    z
      .object({
        name: z.string(),
        size: z.number(),
        type: z.string(),
        lastModified: z.number(),
      })
      .refine((value) => value.size < MAX_FILE_SIZE, "File size is too large")
      .refine(
        (value) => ACCEPTED_IMAGE_TYPES.includes(value.type),
        "Invalid file type"
      )
      .or(z.string())
  ),

  // variations
  attributes: z.array(
    z.object({
      key: z.string(),
      parent: z.string(),
      value: z.string(),
    })
  ),
  variations: z.array(
    z.object({
      key: z.string(),
      combinations: z.record(z.string(), z.string()),
      quantity: z.number(),
      discount: z.number(),
      price: z.number(),
    })
  ),

  // meta data
  meta_title: z.string().trim().max(100),
  meta_description: z.string().trim().max(250),
  meta_keywords: z.string().trim().max(100),
});

export type ReqUpdateProduct = z.infer<typeof updateProduct>;
