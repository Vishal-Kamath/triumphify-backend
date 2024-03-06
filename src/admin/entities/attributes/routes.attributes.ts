import validateResources, {
  blankSchema,
} from "@admin/middlewares/validateResources";
import { Router } from "express";
import { zattributes } from "./validators.attributes";
import attributesControllers from "./controllers/index.attributes.controller";
import { z } from "zod";

const router = Router();

router
  .route("/")
  .get(attributesControllers.handleGetAllAttributes)
  .post(
    validateResources(blankSchema, zattributes, blankSchema),
    attributesControllers.handleCreateAttribute
  );

router
  .route("/:id")
  .get(attributesControllers.handleGetAttributeById)
  .put(
    validateResources(z.object({ id: z.string() }), zattributes, blankSchema),
    attributesControllers.handleUpdateAttribute
  )
  .delete(attributesControllers.handleDeleteAttribute);

export default router;
