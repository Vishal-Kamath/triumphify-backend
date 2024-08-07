import { Router } from "express";
import productControllers from "./controllers/index.products.controllers";

const router = Router();

router.get("/details", productControllers.handleGetAllProducts);
router.get("/details/:slug", productControllers.handleGetProduct);
router.get("/details/:slug/buy", productControllers.handleGetProductBuyDetails);
router.get("/meta/:slug", productControllers.handleGetProductMeta);
router.get("/showcase/:slug", productControllers.handleGetProductShowcase);
router
  .route("/reviews/:productId/all")
  .get(productControllers.handleGetAllReviews);
router
  .route("/reviews/:productId/stats")
  .get(productControllers.handleGetReviewStats);

export default router;
