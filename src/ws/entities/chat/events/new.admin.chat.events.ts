import { TokenPayload } from "@/app/utils/jwt.utils";
import { db } from "@/lib/db";
import { chat, conversation } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Socket } from "socket.io";
import { v4 as uuid } from "uuid";

const handleNewAdminChatEvent = async (socket: Socket, payload: TokenPayload) =>
  socket.on(
    "new-chat-admin",
    async (msg: string, existingRoom: string, cb: (room: string) => void) => {
      const conversationExists = (
        await db
          .select()
          .from(conversation)
          .where(eq(conversation.room, existingRoom))
          .limit(1)
      ).pop();

      if (
        conversationExists !== undefined &&
        conversationExists.status !== "closed"
      ) {
        await db.transaction(async (trx) => {
          if (conversationExists.status === "new") {
            await trx
              .update(conversation)
              .set({ status: "ongoing" })
              .where(eq(conversation.room, existingRoom));
          }
          await trx.insert(chat).values({
            id: uuid(),
            room_id: existingRoom,
            msg,
            sender: "operator",
            sender_id: payload.token.id,
          });
        });

        console.log("message received " + msg);
        socket.broadcast.to(existingRoom).emit("chat-updated", existingRoom);
        cb(existingRoom);
      } else {
        cb("Room does not exist");
      }
    }
  );

export default handleNewAdminChatEvent;
