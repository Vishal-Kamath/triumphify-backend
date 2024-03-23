import validateResources, {
  blankSchema,
} from "@/app/middlewares/validateResources";
import { Router } from "express";
import { contactSchema } from "./validators.contact";
import contactControllers from "./controllers/index.contact.controller";

const router = Router();

router.post(
  "/:source",
  validateResources(blankSchema, contactSchema, blankSchema),
  contactControllers.handleCreateContact
);

export default router;
