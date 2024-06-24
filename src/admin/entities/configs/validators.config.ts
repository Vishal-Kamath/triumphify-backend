import { z } from "zod";

export const googleTagManger = z.object({
  gtmId: z
    .string()
    .refine((value) => value.startsWith("GTM-"), "Invalid GTM ID"),
});
export type ReqGoogleTagManager = z.infer<typeof googleTagManger>;
