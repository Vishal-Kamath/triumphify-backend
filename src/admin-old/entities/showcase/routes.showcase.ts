import { Router } from "express";
import showcaseControllers from "./controllers/index.showcase.controllers";
import validateResources, {
  blankSchema,
} from "@/admin/middlewares/validateResources";
import {
  showcaseA,
  showcaseAUpdate,
  showcaseB,
  showcaseBUpdate,
  showcaseC,
  showcaseCUpdate,
} from "./validators.showcase";

const router = Router();

router.get("/", showcaseControllers.handleGetAllProductShowcase);
router
  .route("/A")
  .post(
    validateResources(blankSchema, showcaseA, blankSchema),
    showcaseControllers.handleCreateShowcaseA
  )
  .put(
    validateResources(blankSchema, showcaseAUpdate, blankSchema),
    showcaseControllers.handleUpdateShowcaseA
  );
router
  .route("/B")
  .post(
    validateResources(blankSchema, showcaseB, blankSchema),
    showcaseControllers.handleCreateShowcaseB
  )
  .put(
    validateResources(blankSchema, showcaseBUpdate, blankSchema),
    showcaseControllers.handleUpdateShowcaseB
  );
router
  .route("/C")
  .post(
    validateResources(blankSchema, showcaseC, blankSchema),
    showcaseControllers.handleCreateShowcaseC
  )
  .put(
    validateResources(blankSchema, showcaseCUpdate, blankSchema),
    showcaseControllers.handleUpdateShowcaseC
  );

router
  .route("/template/:templateId")
  .delete(showcaseControllers.handleDeleteTemplateById);

router.get("/:id", showcaseControllers.handleGetShowcaseById);
export default router;
