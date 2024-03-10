import { Router } from "express";
import productControllers from "./controllers/index.products.controllers";
import validateResources, {
  blankSchema,
} from "@/app/middlewares/validateResources";
import { productId, product_review } from "./validators.products";

const router = Router();

router.get("/details/:slug", productControllers.handleGetProduct);
router.get("/details/:slug/buy", productControllers.handleGetProductBuyDetails);
router.get("/meta/:slug", productControllers.handleGetProductMeta);
router.get("/showcase/:slug", productControllers.handleGetProductShowcase);
router
  .route("/reviews/:productId")
  .post(
    validateResources(productId, product_review, blankSchema),
    productControllers.handleCreateUserProductReview
  );

export default router;
