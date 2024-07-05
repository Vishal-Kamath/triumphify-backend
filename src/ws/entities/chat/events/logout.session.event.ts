import { Socket } from "socket.io";

export const logoutEvent = (socket: Socket) => {
  socket.on("logout", () => {
    socket.emit("loggedOut");
  });
};
