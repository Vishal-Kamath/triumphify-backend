import { z } from "zod";

export const zfile = z.object({
  name: z.string(),
  size: z.number(),
  type: z.string(),
  lastModified: z.number(),
  base64: z.string(),
});
export type ReqFile = z.infer<typeof zfile>;

export const zfileOrString = zfile.or(z.string());
export type ReqFileOrString = z.infer<typeof zfileOrString>;

export const zfileArray = z.object({ files: z.array(zfile) });
export type ReqFileArray = z.infer<typeof zfileArray>;

export const zfileArrayOrString = z.object({ files: z.array(zfileOrString) });
export type ReqFileArrayOrString = z.infer<typeof zfileArrayOrString>;

export const zfileShuffle = z.object({
  shuffleWith: z.string(),
  name: z.string(),
  size: z.number(),
  type: z.string(),
  lastModified: z.number(),
  base64: z.string(),
});
export type ReqFileShuffle = z.infer<typeof zfileShuffle>;

export const imageName = z.object({
  name: z
    .string()
    .refine(
      (val) =>
        val.endsWith(".jpg") ||
        val.endsWith(".png") ||
        val.endsWith(".jpeg") ||
        val.endsWith(".webp"),
      "Invalid format"
    ),
});
export type ReqImageName = z.infer<typeof imageName>;
