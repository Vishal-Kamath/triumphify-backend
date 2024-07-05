import { TokenPayload } from "@/app/utils/jwt.utils";
import { db } from "@/lib/db";
import { conversation } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Socket } from "socket.io";

const handleTerminateRoomAdminEvent = async (
  socket: Socket,
  payload: TokenPayload
) => {
  socket.on(
    "terminate-chat-admin",
    async (roomId: string, cb: (data: any) => void) => {
      console.log("terminate-chat-admin", roomId);
      await db
        .update(conversation)
        .set({ status: "closed" })
        .where(eq(conversation.room, roomId));

      socket.broadcast.to(roomId).to("admin").emit("chat-updated", roomId);
      cb(roomId);
    }
  );
};

export default handleTerminateRoomAdminEvent;
