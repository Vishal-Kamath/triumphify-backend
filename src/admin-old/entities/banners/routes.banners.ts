import validateResources, {
  blankSchema,
} from "@/admin/middlewares/validateResources";
import { Router } from "express";
import { banner, updateBanner } from "./validators.banner";
import bannerControllers from "./controllers/index.banners.controller";
import { z } from "zod";

const router = Router();

router
  .route("/main")
  .get(bannerControllers.handleGetAllBanner("main"))
  .post(
    validateResources(blankSchema, banner, blankSchema),
    bannerControllers.handleCreateBanner("main")
  );

router
  .route("/sub")
  .get(bannerControllers.handleGetAllBanner("sub"))
  .post(
    validateResources(blankSchema, banner, blankSchema),
    bannerControllers.handleCreateBanner("sub")
  );

router
  .route("/:id")
  .get(
    validateResources(z.object({ id: z.string() }), blankSchema, blankSchema),
    bannerControllers.handleGetByIdBanner
  )
  .put(
    validateResources(z.object({ id: z.string() }), updateBanner, blankSchema),
    bannerControllers.handleUpdateBanner
  )
  .delete(
    validateResources(z.object({ id: z.string() }), blankSchema, blankSchema),
    bannerControllers.handleDeleteBanner
  );

export default router;
