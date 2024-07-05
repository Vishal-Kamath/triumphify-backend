import { TokenPayload } from "@/app/utils/jwt.utils";
import { db } from "@/lib/db";
import { chat, conversation } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { Socket } from "socket.io";

const handleGetConversationsEvent = async (
  socket: Socket,
  payload: TokenPayload
) => {
  socket.on("get-conversations", async (cb: (data: any) => void) => {
    const conversations = (
      await db
        .select()
        .from(conversation)
        .where(eq(conversation.user_id, payload.token.id))
    ).sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    const newConversationsList: any[] = [];
    for (const conversation of conversations) {
      const lastMessage = (
        await db
          .select()
          .from(chat)
          .where(eq(chat.room_id, conversation.room))
          .orderBy(desc(chat.created_at))
          .limit(1)
      ).pop();

      newConversationsList.push({
        ...conversation,
        lastMessage,
      });
    }

    cb(newConversationsList);
  });
};

export default handleGetConversationsEvent;
