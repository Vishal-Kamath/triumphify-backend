import { db } from "@/lib/db";
import { conversation } from "@/lib/db/schema";
import { verifyJwt } from "@ws/utils/jwt.utils";
import { parse } from "cookie";
import { and, eq, ne } from "drizzle-orm";
import { Socket } from "socket.io";

const handleInitChatEvents = (socket: Socket) => {
  socket.on("login", async () => {
    if (socket.handshake.headers.cookie) {
      const cookies = parse(socket.handshake.headers.cookie);
      const token = cookies["accessToken"];
      const { decoded, expired, valid } = verifyJwt({
        key: "ACCESS_TOKEN_PUBLIC",
        token,
      });

      if (decoded && !expired && valid) {
        const rooms = (
          await db
            .select()
            .from(conversation)
            .where(
              and(
                eq(conversation.user_id, decoded.token.id),
                ne(conversation.status, "closed")
              )
            )
        ).map((rooms) => rooms.room);

        for (const room of rooms) {
          socket.join(room);
        }

        socket.emit("loggedIn");
      } else {
        socket.emit("unauthorized");
      }
    }
  });
  socket.on("login-admin", async () => {
    if (socket.handshake.headers.cookie) {
      const cookies = parse(socket.handshake.headers.cookie);
      const token = cookies["accessToken-admin"];
      const { decoded, expired, valid } = verifyJwt({
        key: "ACCESS_TOKEN_PUBLIC_ADMIN",
        token,
      });

      if (decoded && !expired && valid) {
        const rooms = (
          await db
            .select()
            .from(conversation)
            .where(ne(conversation.status, "closed"))
        ).map((rooms) => rooms.room);

        for (const room of rooms) {
          socket.join(room);
        }
        socket.join("admin");

        socket.emit("loggedIn");
      } else {
        socket.emit("unauthorized");
      }
    }
  });
};

export default handleInitChatEvents;
