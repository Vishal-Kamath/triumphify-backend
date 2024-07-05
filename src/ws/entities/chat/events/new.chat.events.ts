import { TokenPayload } from "@/app/utils/jwt.utils";
import { db } from "@/lib/db";
import { chat, conversation } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Socket } from "socket.io";
import { v4 as uuid } from "uuid";

const handleNewChatEvent = async (socket: Socket, payload: TokenPayload) =>
  socket.on(
    "new-chat",
    async (msg: string, existingRoom: string, cb: (room: string) => void) => {
      const conversationExists = (
        await db
          .select()
          .from(conversation)
          .where(eq(conversation.room, existingRoom))
          .limit(1)
      ).pop();

      if (conversationExists !== undefined) {
        await db.insert(chat).values({
          id: uuid(),
          room_id: existingRoom,
          msg,
          sender: "customer",
          sender_id: payload.token.id,
        });

        socket.broadcast
          .to(existingRoom)
          .to("admin")
          .emit("chat-updated", existingRoom);
        console.log("message received " + msg);
        cb(existingRoom);
      } else {
        const room = uuid();
        await db.transaction(async (trx) => {
          await trx.insert(conversation).values({
            room,
            user_id: payload.token.id,
            status: "new",
          });

          await trx.insert(chat).values({
            id: uuid(),
            room_id: room,
            msg,
            sender: "customer",
            sender_id: payload.token.id,
          });
        });

        socket.join(room);
        socket.broadcast.to(room).to("admin").emit("chat-updated", room);
        console.log("message received " + msg);
        cb(room);
      }
    }
  );

export default handleNewChatEvent;
