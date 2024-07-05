import { TokenPayload } from "@/app/utils/jwt.utils";
import { db } from "@/lib/db";
import { chat, conversation, users } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { Socket } from "socket.io";

const handleGetAdminConversationsEvent = async (socket: Socket) => {
  socket.on("get-conversations-admin", async (cb: (data: any) => void) => {
    const conversations = (
      await db
        .select({
          room: conversation.room,
          user: users,
          status: conversation.status,
          created_at: conversation.created_at,
          updated_at: conversation.updated_at,
        })
        .from(conversation)
        .leftJoin(users, eq(conversation.user_id, users.id))
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

export default handleGetAdminConversationsEvent;
