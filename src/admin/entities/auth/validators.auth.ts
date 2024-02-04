import z from "zod";

export const login = z.object({
  username: z.string(),
  password: z.string(),
});
export type ReqLogin = z.infer<typeof login>;
