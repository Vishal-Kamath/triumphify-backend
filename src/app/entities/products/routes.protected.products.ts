import { Router } from "express";
import productControllers from "./controllers/index.products.controllers";
import validateResources, {
  blankSchema,
} from "@/app/middlewares/validateResources";
import { productId, product_review } from "./validators.products";

const router = Router();

router
  .route("/reviews/:productId")
  .get(productControllers.handeGetByIdUserReview)
  .post(
    validateResources(productId, product_review, blankSchema),
    productControllers.handleCreateUserProductReview
  )
  .put(
    validateResources(productId, product_review, blankSchema),
    productControllers.handleUpdateUserProductReview
  )
  .delete(productControllers.handleDeleteUserReview);

export default router;
