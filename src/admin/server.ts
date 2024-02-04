import "module-alias/register";

import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import { Logger } from "@/utils/logger";
import { env } from "@/config/env.config";
import cors from "cors";

import userRouter from "@admin/entities/user/routes.user";
import authRouter from "@admin/entities/auth/routes.auth";

const app = express();
const PORT = env.ADMIN_PORT || 4500;

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// request logger
app.use(Logger.requestLogger);

// -------------------------------------------------
// Routes
// -------------------------------------------------
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// -------------------------------------------------
// Protected Routes
// -------------------------------------------------
import adminEmployeeRoutes from "./entities/employees/routes.admin.employee";

app.use("/api/employees", adminEmployeeRoutes);

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
