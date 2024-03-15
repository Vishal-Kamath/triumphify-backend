import { Router } from "express";
import categoriesController from "./controllers/index.categories.controller";
import validateResources, {
  blankSchema,
} from "@/admin/middlewares/validateResources";
import { category, categoryUpdate } from "./validators.catrgories";
import { z } from "zod";

const router = Router();

router
  .route("/")
  .get(categoriesController.handleGetAllCategories)
  .post(
    validateResources(blankSchema, category, blankSchema),
    categoriesController.handleCreateCategory
  );

router
  .route("/:id")
  .get(categoriesController.handleGetCategoryById)
  .put(
    validateResources(
      z.object({ id: z.string() }),
      categoryUpdate,
      blankSchema
    ),
    categoriesController.handleUpdateCategory
  )
  .delete(categoriesController.handleDeleteCategory);

export default router;
