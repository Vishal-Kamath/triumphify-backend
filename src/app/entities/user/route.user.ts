import { Router } from "express";
import validateResources, {
  blankSchema,
} from "@app/middlewares/validateResources";
import { LoginSchema, SignupSchema } from "./validators.user";
import userControllers from "./controllers/index.user.controller";

const router = Router();

router.post(
  "/login",
  validateResources(blankSchema, LoginSchema, blankSchema),
  userControllers.handleLogin
);

router.post(
  "/signup",
  validateResources(blankSchema, SignupSchema, blankSchema),
  userControllers.handleSignUp
);

export default router;
