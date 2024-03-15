import "module-alias/register";

import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import { Logger } from "@/utils/logger";
import { env } from "@/config/env.config";
import cors from "cors";
import { healthCheck } from "@/utils/healthcheck";
import validateEmployee from "@admin/middlewares/validateEmployee";
import validateAdmin from "@admin/middlewares/validateAdmin";
import validateSuperAdmin from "@admin/middlewares/validateSuperAdmin";

const app = express();
const PORT = env.ADMIN_PORT || 4500;

app.use(
  cors({
    origin: [env.ADMIN_WEBSITE],
    credentials: true,
  })
);

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());

// request logger
app.use(Logger.requestLogger);

app.get("/", healthCheck("hello from Triumphify admin server"));

// -------------------------------------------------
// Routes
// -------------------------------------------------
// -------------------------------------------------
// Protected Routes (Employee)
// -------------------------------------------------
app.use(validateEmployee);
// -------------------------------------------------
// Protected Routes (Admin)
// -------------------------------------------------
app.use(validateAdmin);
// -------------------------------------------------
// Protected Routes (Superdmin)
// -------------------------------------------------
app.use(validateSuperAdmin);

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
