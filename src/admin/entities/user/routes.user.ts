import { Router } from "express";
import userControllers from "./controllers/index.user.controller";

const router = Router();

router.get("/", userControllers.handleGetAllUsers);
router.get("/top", userControllers.handleGetTopUser);
router.get("/newUsers", userControllers.handleGetNewUsers);
router.get("/:userId", userControllers.handleGetUserById);
router.get("/:userId/orders", userControllers.handleGetUserOrders);
router.get("/:userId/reviews", userControllers.handleGetUserReviews);
router.get("/:userId/stats", userControllers.handleGetUserStats);

export default router;
