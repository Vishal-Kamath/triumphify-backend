import { Router } from "express";
import configControllers from "./controllers/index.configs.controller";
import validateResources, {
  blankSchema,
} from "@/admin/middlewares/validateResources";
import { googleTagManger } from "./validators.config";

const router = Router();

router
  .route("/google-tag-manager")
  .get(configControllers.handleGetGoogleTagMangerConfig)
  .post(
    validateResources(blankSchema, googleTagManger, blankSchema),
    configControllers.handleAddGoogleTagManagerConfig
  )
  .put(
    validateResources(blankSchema, googleTagManger, blankSchema),
    configControllers.handleUpdateGoogleTagManagerConfig
  )
  .delete(configControllers.handleDeleteGoogleTagManagerConfig);

export default router;
