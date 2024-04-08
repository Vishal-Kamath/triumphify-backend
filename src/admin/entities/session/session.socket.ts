import { Server as HTTPServerType } from "http";
import { Server } from "socket.io";
import { env } from "@/config/env.config";
import { EmployeeSessionService } from "./session.service";
import sessionEvents from "./events/index.session.events";

function employeeSessionSocket(server: HTTPServerType) {
  const io = new Server(server, {
    cors: {
      origin: [env.ADMIN_WEBSITE],
      credentials: true,
    },
    cookie: true,
  });

  io.on("connection", (socket) => {
    sessionEvents.loginEvent(socket);
    sessionEvents.logoutEvent(socket);
    sessionEvents.disconnect(socket);
  });
}

export default employeeSessionSocket;
