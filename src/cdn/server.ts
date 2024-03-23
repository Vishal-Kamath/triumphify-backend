import "module-alias/register";

import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Logger } from "@/utils/logger";
import { env } from "@/config/env.config";

import imageRoutes from "@cdn/entities/image/routes.image";
import { healthCheck } from "@/utils/healthcheck";

const app = express();
const PORT = env.CDN_PORT || 5000;

app.use(
  cors({
    origin: [
      env.WEBSITE,
      env.APP_WEBSITE,
      env.ADMIN_WEBSITE,
      env.ADMIN_ENDPOINT,
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

app.get("/", healthCheck("hello from Triumphify cdn server"));
// -------------------------------------------------
// Protected Routes
// -------------------------------------------------
app.use("/api/images", imageRoutes);

// 404
app.all("*", (req: Request, res: Response) => {
  if (req.accepts("json")) {
    res.json({ error: "404 not found" });
  }
  if (req.accepts("txt")) {
    res.send("404 not found");
  }
});

app.listen(PORT, () => {
  Logger.info(`Server listening on port ${PORT}`);
});
