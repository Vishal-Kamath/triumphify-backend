import { Router } from "express";
import userControllers from "@app/entities/user/controllers/index.user.controller";
import validateResources, {
  blankSchema,
} from "@/app/middlewares/validateResources";
import {
  userDetailsSchema,
  userUpdatePassword,
  userVerifyEmailOtp,
} from "./validators.user";

const router = Router();

router.get("/", userControllers.handleGetUser);
router.put(
  "/update/details",
  validateResources(blankSchema, userDetailsSchema, blankSchema),
  userControllers.handleUpdateUser
);
router.put(
  "/update/password",
  validateResources(blankSchema, userUpdatePassword, blankSchema),
  userControllers.handleUpdatePassword
);

router.get("/otp/send", userControllers.handleSendEmailOTP);
router.post(
  "/otp/verify",
  validateResources(blankSchema, userVerifyEmailOtp, blankSchema),
  userControllers.handleVerifyOtp
);

export default router;
