import categoriesControllers from "./controllers/index.categories.controllers";
import { Router } from "express";

const router = Router();

router.get("/", categoriesControllers.handleGetAllCategories);
router.route("/:slug").get(categoriesControllers.handleGetCategoryBySlug);

export default router;
