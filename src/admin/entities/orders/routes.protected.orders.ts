import { Router } from "express";
import orderControllers from "./controllers/index.orders.controllers";

const router = Router();

router.route("/analytics").get(orderControllers.handleOrderAnalyticsList);
router
  .route("/analytics/:productId/variations")
  .get(orderControllers.handleGetVariationSales);

export default router;
