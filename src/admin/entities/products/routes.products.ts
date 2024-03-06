import { Router } from "express";
import productControllers from "./controllers/index.products.controllers";
import validateResources, {
  blankSchema,
} from "@admin/middlewares/validateResources";
import { product, updateProduct } from "./validators.products";

const router = Router();

router
  .route("/")
  .get(productControllers.handleGetProducts)
  .post(
    validateResources(blankSchema, product, blankSchema),
    productControllers.handleCreateProduct
  );

router
  .route("/:id")
  .get(productControllers.handleGetByIdProducts)
  .post(
    validateResources(blankSchema, updateProduct, blankSchema),
    productControllers.handleUpdateProduct
  )
  .delete(productControllers.handleDeleteProduct);

export default router;
