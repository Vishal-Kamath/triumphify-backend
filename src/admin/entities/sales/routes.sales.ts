import { Router } from "express";
import salesControllers from "./controllers/index.sales.controllers";

const router = Router();

router.get("/category/:categoryId", salesControllers.handelGetSalesByCategory);
router.get("/product", salesControllers.handleGetSalesByProduct);

export default router;
