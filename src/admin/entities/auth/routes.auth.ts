import { Router } from "express";
import validateResources, {
  blankSchema,
} from "@admin/middlewares/validateResources";
import { employeeEmail, login } from "./validators.auth";
import authControllers from "@admin/entities/auth/controllers/index.auth.controller";
import { resetPassword } from "@/app/entities/auth/validators.user";

const router = Router();

router.post(
  "/login",
  validateResources(blankSchema, login, blankSchema),
  authControllers.handleLogin
);

router.get("/signout", authControllers.handleSignOut);

router.post(
  "/password/send-reset-link",
  validateResources(blankSchema, employeeEmail, blankSchema),
  authControllers.handleSendResetPasswordLink
);

router.post(
  "/password/reset",
  validateResources(blankSchema, resetPassword, blankSchema),
  authControllers.handleResetPassword
);

export default router;
