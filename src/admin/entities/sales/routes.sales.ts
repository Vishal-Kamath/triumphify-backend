import { Router } from "express";
import salesControllers from "./controllers/index.sales.controllers";

const router = Router();

router.get("/", salesControllers.handleGetSales);
router.get("/category/:categoryId", salesControllers.handleGetSalesByCategory);
router.get("/product/:productId", salesControllers.handleGetSalesByProduct);

export default router;
