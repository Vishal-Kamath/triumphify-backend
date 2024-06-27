import { Router } from "express";
import productControllers from "./controllers/index.products.controllers";
import validateResources, {
  blankSchema,
} from "@admin/middlewares/validateResources";
import {
  linkToBanner,
  pinned,
  product,
  status,
  updateProduct,
} from "./validators.products";

const router = Router();

router
  .route("/")
  .get(productControllers.handleGetProducts)
  .post(
    validateResources(blankSchema, product, blankSchema),
    productControllers.handleCreateProduct
  );

router.route("/reviews").get(productControllers.handleGetAllReviewsList);
router
  .route("/reviews/pinned/:reviewId")
  .patch(
    validateResources(blankSchema, pinned, blankSchema),
    productControllers.handleUserReviewsPinned
  );
router
  .route("/reviews/status/:reviewId")
  .patch(
    validateResources(blankSchema, status, blankSchema),
    productControllers.handleUserReviewsStatus
  );
router
  .route("/reviews/:productId/stats")
  .get(productControllers.handleGetReviewStats);
router
  .route("/reviews/:productId/")
  .get(productControllers.handleGetAllReviews);

router
  .route("/:id")
  .get(productControllers.handleGetByIdProducts)
  .post(
    validateResources(blankSchema, updateProduct, blankSchema),
    productControllers.handleUpdateProduct
  )
  .delete(productControllers.handleDeleteProduct);

router
  .route("/:id/link")
  .post(
    validateResources(blankSchema, linkToBanner, blankSchema),
    productControllers.handleLinkProductToBanner
  );
  
export default router;
