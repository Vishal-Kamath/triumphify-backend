import { z } from "zod";

export const zattributes = z.object({
  name: z.string().max(100),
  values: z
    .object({
      id: z.string().max(36),
      name: z
        .string()
        .max(50)
        .refine((data) => !!data.trim(), "Field is required"),
    })
    .array(),
});
export type ReqAttributes = z.infer<typeof zattributes>;
