import { TokenPayload } from "@/app/utils/jwt.utils";
import { db } from "@/lib/db";
import { chat, conversation } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { Socket } from "socket.io";

const handleUpdateChatEvent = async (socket: Socket, payload: TokenPayload) => {
  socket.on("update-chat", async (room: string, cb: (data: any) => void) => {
    const isValidRoom = (
      await db
        .select()
        .from(conversation)
        .where(
          and(
            eq(conversation.room, room),
            eq(conversation.user_id, payload.token.id)
          )
        )
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
  });
};

export default handleUpdateChatEvent;
