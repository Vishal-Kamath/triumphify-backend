import validateResources, {
  blankSchema,
} from "@/app/middlewares/validateResources";
import { Router } from "express";
import { addToCart, quantity } from "./validators.cart";
import cartControllers from "./controllers/index.cart.controller";

const router = Router();

router
  .route("/")
  .get(cartControllers.handleGetAllCart)
  .post(
    validateResources(blankSchema, addToCart, blankSchema),
    cartControllers.handleCreateCart
  );

router
  .route("/:cartId")
  .patch(
    validateResources(blankSchema, quantity, blankSchema),
    cartControllers.handleUpdateQuantityCart
  )
  .delete(cartControllers.handleRemoveCartItem);

export default router;
