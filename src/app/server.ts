import "module-alias/register";

import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Logger } from "@/utils/logger";
import { env } from "@/config/env.config";

import authRoutes from "@app/entities/auth/routes.auth";
import bannerRoutes from "@app/entities/banners/routes.banner";
import categoryRoutes from "@app/entities/categories/routes.categories";
import productsRoutes from "@app/entities/products/routes.products";
import wishlistRoutes from "@app/entities/wishlist/routes.wishlist";
import cartRoutes from "@app/entities/cart/routes.cart";
import addressRoutes from "@app/entities/address/routes.address";
import ordersRoutes from "@app/entities/orders/routes.orders";
import userRoutes from "@app/entities/user/route.user";
import userProtectedRoutes from "@app/entities/user/protected.routes.user";
import validateUser from "@app/middlewares/validateUser";
import initPassport from "@app/entities/auth/config/passport.config";
import { healthCheck } from "@/utils/healthcheck";

const app = express();
const PORT = env.PORT || 4000;

app.use(
  cors({
    origin: [env.APP_WEBSITE],
    credentials: true,
  })
);

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// request logger
app.use(Logger.requestLogger);

app.get("/", healthCheck("hello from Triumphify server"))
// -------------------------------------------------
// Routes
// -------------------------------------------------
initPassport(app);
app.use("/api/auth", authRoutes);
// app.use(" ", userRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productsRoutes);

// -------------------------------------------------
// Protected Routes
// -------------------------------------------------
app.use(validateUser);

app.use("/api/user", userProtectedRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/orders", ordersRoutes);

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