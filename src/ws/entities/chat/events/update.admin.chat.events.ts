import { TokenPayload } from "@/app/utils/jwt.utils";
import { db } from "@/lib/db";
import { chat, conversation } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { Socket } from "socket.io";

const handleUpdateAdminChatEvent = async (
  socket: Socket,
  payload: TokenPayload
) => {
  socket.on(
    "update-chat-admin",
    async (room: string, cb: (data: any) => void) => {
      const isValidRoom = (
        await db
          .select()
          .from(conversation)
          .where(eq(conversation.room, room))
          .limit(1)
      ).pop();
      if (!isValidRoom) {
        return cb([]);
      }

      const chats = (
        await db.select().from(chat).where(eq(chat.room_id, room))
      ).sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      cb(chats);
    }
  );
};

export default handleUpdateAdminChatEvent;
