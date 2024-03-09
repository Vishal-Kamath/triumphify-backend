import validateResources, {
  blankSchema,
} from "@/app/middlewares/validateResources";
import { Router } from "express";
import { placeOrders } from "./validators.orders";
import orderControllers from "./controllers/index.orders.controllers";

const router = Router();

router
  .route("/")
  .post(
    validateResources(blankSchema, placeOrders, blankSchema),
    orderControllers.handlePlaceOrders
  );

router.route("/:type").get(orderControllers.handleGetAllOrders);

export default router;
