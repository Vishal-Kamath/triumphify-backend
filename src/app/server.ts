import "module-alias/register";

import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Logger } from "@/utils/logger";
import { env } from "@/config/env.config";

import authRoutes from "@app/entities/auth/routes.auth";
import userRoutes from "@app/entities/user/route.user";
import userProtectedRoutes from "@app/entities/user/protected.routes.user";
import validateUser from "./middlewares/validateUser";
import initPassport from "./entities/auth/config/passport.config";

const app = express();
const PORT = env.PORT || 4000;

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
initPassport(app);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// -------------------------------------------------
// Protected Routes
// -------------------------------------------------
app.use(validateUser);

app.use("/api/user", userProtectedRoutes);

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