import { z } from "zod";

export const zassigned = z.object({
  assigned: z.string().nullable(),
});
export type zAssigned = z.infer<typeof zassigned>;
export const zstatus = z.object({
  status: z.enum(["pending", "completed", "failed"]),
});
export type zStatus = z.infer<typeof zstatus>;

export const zticketChat = z.object({
  content: z.string(),
});

export type zTicketChat = z.infer<typeof zticketChat>;
