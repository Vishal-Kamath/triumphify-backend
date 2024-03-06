import "module-alias/register";

import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import { Logger } from "@/utils/logger";
import { env } from "@/config/env.config";
import cors from "cors";

import userRouter from "@admin/entities/user/routes.user";
import authRouter from "@admin/entities/auth/routes.auth";

import superadminEmployeeRoutes from "@admin/entities/employees/routes.superadmin.employee";
import employeeRoutes from "@admin/entities/employees/routes.employee";
import categoriesRoutes from "@admin/entities/categories/routes.categories";
import attributesRoutes from "@admin/entities/attributes/routes.attributes";
import productsRoutes from "@admin/entities/products/routes.products";
import bannersRoutes from "@admin/entities/banners/routes.banners";
import showcaseRoutes from "@admin/entities/showcase/routes.showcase";
import ordersRoutes from "@admin/entities/orders/routes.orders";
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
app.use("/api/orders", ordersRoutes);

// -------------------------------------------------
// Protected Routes (Admin)
// -------------------------------------------------
app.use(validateAdmin);
// -------------------------------------------------
// Protected Routes (Superdmin)
// -------------------------------------------------
app.use(validateSuperAdmin);
app.use("/api/employees", superadminEmployeeRoutes);

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
