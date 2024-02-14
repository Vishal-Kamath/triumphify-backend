import validateResources, {
  blankSchema,
} from "@app/middlewares/validateResources";
import { Router } from "express";
import {
  LoginSchema,
  SignupSchema,
  resetPassword,
  userEmail,
} from "./validators.user";
import authControllers from "./controllers/index.auth.controller";
import { passportConfig } from "./controllers/google.auth.controller";
import passport from "passport";

const router = Router();

router.post(
  "/login",
  validateResources(blankSchema, LoginSchema, blankSchema),
  authControllers.handleLogin
);

router.post(
  "/signup",
  validateResources(blankSchema, SignupSchema, blankSchema),
  authControllers.handleSignUp
);

router.get("/signout", authControllers.handleSignOut);

router.post(
  "/password/send-reset-link",
  validateResources(blankSchema, userEmail, blankSchema),
  authControllers.handleSendResetPasswordLink
);

router.post(
  "/password/reset",
  validateResources(blankSchema, resetPassword, blankSchema),
  authControllers.handleResetPassword
);

// oauth
router.get("/google", passport.authenticate("google", passportConfig));
router.get(
  "/google/redirect",
  passport.authenticate("google"),
  authControllers.handleGoogleAuth
);

export default router;
