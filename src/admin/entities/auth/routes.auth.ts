import { Router } from "express";
import validateResources, {
  blankSchema,
} from "@admin/middlewares/validateResources";
import { login } from "./validators.auth";
import authControllers from "@admin/entities/auth/controllers/index.auth.controller";

const router = Router();

router.post(
  "/login",
  validateResources(blankSchema, login, blankSchema),
  authControllers.handleLogin
);

export default router;
