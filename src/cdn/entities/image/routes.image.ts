import { Router } from "express";
import imageControllers from "./controllers/index.image.controller";
import validateResources, {
  blankSchema,
} from "@cdn/middlewares/validateResources";
import {
  imageName,
  zfile,
  zfileArray,
  zfileArrayOrString,
  zfileShuffle,
} from "./validators.image";

const router = Router();

router.post(
  "/upload",
  validateResources(blankSchema, zfile, blankSchema),
  imageControllers.handleUploadImage
);
router.post(
  "/multiple",
  validateResources(blankSchema, zfileArray, blankSchema),
  imageControllers.handleMultipleImageUpload
);
router.post(
  "/multiple/conditional",
  validateResources(blankSchema, zfileArrayOrString, blankSchema),
  imageControllers.handleConditionalMultipleImage
);
router.post(
  "/shuffle",
  validateResources(blankSchema, zfileShuffle, blankSchema),
  imageControllers.handleShuffleImage
);
router
  .route("/delete/multiple")
  .post(imageControllers.handleDeleteMultipleImagePost)
  .delete(imageControllers.handleDeleteMultipleImage);

export default router;
