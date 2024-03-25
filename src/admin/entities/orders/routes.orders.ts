import { Router } from "express";
import orderControllers from "./controllers/index.orders.controllers";
import validateResources, {
  blankSchema,
} from "@/admin/middlewares/validateResources";
import { orderStatus } from "./validators.orders";

const router = Router();

router.route("/").get(orderControllers.handleGetAllOrders);
router
  .route("/:orderId")
  .get(orderControllers.handleGetByIdOrdersControllers)
  .patch(
    validateResources(blankSchema, orderStatus, blankSchema),
    orderControllers.handleUpdateOrderStatus
  );

router.route("/:orderId/cancel").delete(orderControllers.handleCancelOrder);

export default router;
