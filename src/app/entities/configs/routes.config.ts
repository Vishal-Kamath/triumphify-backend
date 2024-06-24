import { Router } from "express";
import configControllers from "./controllers/index.configs.controller";

const router = Router();

router
  .route("/google-tag-manager")
  .get(configControllers.handleGetGoogleTagMangerConfig);

export default router;
