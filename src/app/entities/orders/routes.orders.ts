import validateResources, {
  blankSchema,
} from "@/app/middlewares/validateResources";
import { Router } from "express";
import { placeOrders, requestCancelReturn } from "./validators.orders";
import orderControllers from "./controllers/index.orders.controllers";

const router = Router();

router
  .route("/")
  .post(
    validateResources(blankSchema, placeOrders, blankSchema),
    orderControllers.handlePlaceOrders
  );

router.route("/details/:orderId").get(orderControllers.handleGetOrderById);
router
  .route("/request/:orderId/cancel")
  .post(
    validateResources(blankSchema, requestCancelReturn, blankSchema),
    orderControllers.handleCancelOrderRequest
  );
router.route("/:type").get(orderControllers.handleGetAllOrders);

export default router;
