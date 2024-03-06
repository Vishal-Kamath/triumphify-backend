import wishlistControllers from "./controllers/index.wishlist.controller";
import { Router } from "express";

const router = Router();

router.get("/", wishlistControllers.handleGetAllWishlist);
router.get("/:productId/add", wishlistControllers.handleAddToWishlist);
router.get("/:productId/remove", wishlistControllers.handleRemoveFromWishlist);

export default router;
