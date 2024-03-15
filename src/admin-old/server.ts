import "module-alias/register";

import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import { Logger } from "@/utils/logger";
import { env } from "@/config/env.config";
import cors from "cors";

import userRouter from "@admin-old/entities/user/routes.user";
import authRouter from "@admin-old/entities/auth/routes.auth";

import superadminEmployeeRoutes from "@admin-old/entities/employees/routes.superadmin.employee";
import employeeRoutes from "@admin-old/entities/employees/routes.employee";
import categoriesRoutes from "@admin-old/entities/categories/routes.categories";
import attributesRoutes from "@admin-old/entities/attributes/routes.attributes";
import productsRoutes from "@admin-old/entities/products/routes.products";
import bannersRoutes from "@admin-old/entities/banners/routes.banners";
import showcaseRoutes from "@admin-old/entities/showcase/routes.showcase";
import ordersRoutes from "@admin-old/entities/orders/routes.orders";
import ordersProtectedRoutes from "@admin-old/entities/orders/routes.protected.orders";
import validateEmployee from "@admin-old/middlewares/validateEmployee";
import validateAdmin from "@admin-old/middlewares/validateAdmin";
import validateSuperAdmin from "@admin-old/middlewares/validateSuperAdmin";
import { healthCheck } from "@/utils/healthcheck";

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
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// -------------------------------------------------
// Protected Routes (Employee)
// -------------------------------------------------
app.use(validateEmployee);
app.use("/api/employees", employeeRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/attributes", attributesRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/banners", bannersRoutes);
app.use("/api/showcases", showcaseRoutes);
app.use("/api/employee/orders", ordersRoutes);

// -------------------------------------------------
// Protected Routes (Admin)
// -------------------------------------------------
app.use(validateAdmin);
// -------------------------------------------------
// Protected Routes (Superdmin)
// -------------------------------------------------
app.use(validateSuperAdmin);
app.use("/api/employees", superadminEmployeeRoutes);
app.use("/api/orders", ordersProtectedRoutes);

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
