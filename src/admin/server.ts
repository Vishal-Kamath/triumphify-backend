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
import authRouter from "@admin/entities/auth/routes.auth";

app.use("/api/auth", authRouter);
// -------------------------------------------------
// Protected Routes (Employee)
// -------------------------------------------------
import employeeRoutes from "@admin/entities/employees/routes.employee";
import userRouter from "@admin/entities/user/routes.user";
import leadsRouter from "@admin/entities/leads/routes.leads";
import categoriesRoutes from "@admin/entities/categories/routes.categories";
import attributesRoutes from "@admin/entities/attributes/routes.attributes";
import productsRoutes from "@admin/entities/products/routes.products";
import bannersRoutes from "@admin/entities/banners/routes.banners";
import showcaseRoutes from "@admin/entities/showcase/routes.showcase";
import ordersRoutes from "@admin/entities/orders/routes.orders";
import ticketsRoutes from "@admin/entities/tickets/routes.tickets";

app.use(validateEmployee);
app.use("/api/employees", employeeRoutes);
app.use("/api/user", userRouter);
app.use("/api/leads", leadsRouter);
app.use("/api/categories", categoriesRoutes);
app.use("/api/attributes", attributesRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/banners", bannersRoutes);
app.use("/api/showcases", showcaseRoutes);
app.use("/api/employee/orders", ordersRoutes);
app.use("/api/tickets", ticketsRoutes);

// -------------------------------------------------
// Protected Routes (Admin)
// -------------------------------------------------
import adminEmployeeRoutes from "@admin/entities/employees/routes.admin.employees";
import adminLeadsRouter from "@admin/entities/leads/routes.admin.leads";
import adminTicketsRouter from "@admin/entities/tickets/routes.admin.tickets";

app.use(validateAdmin);
app.use("/api/employees", adminEmployeeRoutes);
app.use("/api/leads", adminLeadsRouter);
app.use("/api/tickets", adminTicketsRouter);


// -------------------------------------------------
// Protected Routes (Superdmin)
// -------------------------------------------------
import superadminEmployeeRoutes from "@admin/entities/employees/routes.superadmin.employee";
import ordersProtectedRoutes from "@admin/entities/orders/routes.protected.orders";

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
