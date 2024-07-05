import "module-alias/register";

import express, { Request, Response } from "express";
import http from "http";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Logger } from "@/utils/logger";
import { env } from "@/config/env.config";

import { healthCheck } from "@/utils/healthcheck";
import chatSocket from "./entities/chat/chat.socket";

const app = express();
const server = http.createServer(app);
const PORT = env.WS_PORT || 5500;

app.use(
  cors({
    origin: [
      env.WEBSITE,
      env.APP_WEBSITE,
      env.ADMIN_WEBSITE,
      env.ADMIN_ENDPOINT,
      "https://admin.socket.io",
    ],
    credentials: true,
  })
);

// Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());

// request logger
app.use(Logger.requestLogger);

app.get("/", healthCheck("hello from Triumphify Web socket server"));
// -------------------------------------------------
// Routes
// -------------------------------------------------
chatSocket(server);

// -------------------------------------------------
// Protected Routes
// -------------------------------------------------

// 404
app.all("*", (req: Request, res: Response) => {
  if (req.accepts("json")) {
    res.json({ error: "404 not found" });
  }
  if (req.accepts("txt")) {
    res.send("404 not found");
  }
});

server.listen(PORT, () => {
  Logger.info(`Server listening on port ${PORT}`);
});
