import { z } from "zod";

export const zassigned = z.object({
  assigned: z.string().nullable(),
});
export type zAssigned = z.infer<typeof zassigned>;

export const zticketChat = z.object({
  content: z.string(),
});

export type zTicketChat = z.infer<typeof zticketChat>;
