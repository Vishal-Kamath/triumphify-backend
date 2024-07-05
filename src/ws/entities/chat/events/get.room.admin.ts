import { db } from "@/lib/db";
import { conversation, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Socket } from "socket.io";

const handleGetRoomEvent = async (socket: Socket) => {
  socket.on("get-room-admin", async (room: string, cb: (data: any) => void) => {
    const conversationDetail = (
      await db
        .select()
        .from(conversation)
        .where(eq(conversation.room, room))
        .limit(1)
    ).pop();

    cb(conversationDetail);
  });
};

export default handleGetRoomEvent;
