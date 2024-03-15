import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1080 * 1080;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const zfile = z
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
  );
export type ZFile = z.infer<typeof zfile>;
const zfileOrString = zfile.or(z.string());

export const showcaseA = z.object({
  template: z.literal("A"),
  product_id: z.string(),
  content: z.object({
    title: z.string(),
    description: z.string(),
    template_image: zfile,
  }),
});

export type ReqShowcaseA = z.infer<typeof showcaseA>;

export const showcaseB = z.object({
  template: z.literal("B"),
  product_id: z.string(),
  content: z.object({
    title0: z.string(),
    description0: z.string(),
    template_image0: zfile,
    title1: z.string(),
    description1: z.string(),
    template_image1: zfile,
    title2: z.string(),
    description2: z.string(),
    template_image2: zfile,
  }),
});

export type ReqShowcaseB = z.infer<typeof showcaseB>;

export const showcaseC = z.object({
  template: z.literal("C"),
  product_id: z.string(),
  content: z.object({
    title0: z.string(),
    description0: z.string(),
    template_image0: zfile,
    title1: z.string(),
    description1: z.string(),
    template_image1: zfile,
  }),
});

export type ReqShowcaseC = z.infer<typeof showcaseC>;

// Update

export const showcaseAUpdate = z.object({
  templateId: z.string(),
  template: z.literal("A"),
  product_id: z.string(),
  content: z.object({
    title: z.string(),
    description: z.string(),
    template_image: zfileOrString,
  }),
});

export type ReqShowcaseAUpdate = z.infer<typeof showcaseAUpdate>;

export const showcaseBUpdate = z.object({
  templateId: z.string(),
  template: z.literal("B"),
  product_id: z.string(),
  content: z.object({
    title0: z.string(),
    description0: z.string(),
    template_image0: zfileOrString,
    title1: z.string(),
    description1: z.string(),
    template_image1: zfileOrString,
    title2: z.string(),
    description2: z.string(),
    template_image2: zfileOrString,
  }),
});

export type ReqShowcaseBUpdate = z.infer<typeof showcaseBUpdate>;

export const showcaseCUpdate = z.object({
  templateId: z.string(),
  template: z.literal("C"),
  product_id: z.string(),
  content: z.object({
    title0: z.string(),
    description0: z.string(),
    template_image0: zfileOrString,
    title1: z.string(),
    description1: z.string(),
    template_image1: zfileOrString,
  }),
});

export type ReqShowcaseCUpdate = z.infer<typeof showcaseCUpdate>;
