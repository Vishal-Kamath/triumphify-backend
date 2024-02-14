import { Router } from "express";
import categoriesController from "./controllers/index.categories.controller";
import validateResources, {
  blankSchema,
} from "@/admin/middlewares/validateResources";
import { category } from "./validators.catrgories";

const router = Router();

router.get("/", (req, res) => {
  res.send("categories");
});

router.post(
  "/",
  validateResources(blankSchema, category, blankSchema),
  categoriesController.handleCreateCategory
);

export default router;
