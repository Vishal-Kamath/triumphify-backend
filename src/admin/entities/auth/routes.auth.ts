import { Router } from "express";
import validateResources, {
  blankSchema,
} from "@admin/middlewares/validateResources";
import { login } from "./validators.auth";

const router = Router();

router.post("/login", validateResources(blankSchema, login, blankSchema));

export default router;
