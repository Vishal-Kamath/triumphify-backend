import { Router } from "express";
import orderControllers from "./controllers/index.orders.controllers";

const router = Router();

router.route("/").get(orderControllers.handleGetAllOrders);
router.route("/:orderId").get(orderControllers.handleGetByIdOrdersControllers);

export default router;
