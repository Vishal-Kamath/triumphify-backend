import { Logger } from "@/utils/logger";
import { Request, Response } from "express";
import { addTokens, removeTokens } from "../utils/auth";
import { DbUser } from "@/lib/db/schema";
import { env } from "@/config/env.config";

export const passportConfig = {
  scope: ["profile", "email"],
  prompt: "consent",
  successRedirect: "/api/auth/google/redirect",
  failureRedirect: "/api/auth/google/redirect",
};

const handleGoogleAuth = async (req: Request, res: Response) => {
  try {
    const { id } = req.user as DbUser;
    if (!id) return res.redirect(302, env.APP_WEBSITE);

    removeTokens(res);
    addTokens(res, id);
    res.redirect(302, env.APP_WEBSITE);
  } catch (err) {
    Logger.error("handle google oauth error", err);
    res.status(500).json({ title: "Internal server error", type: "error" });
  }
};

export default handleGoogleAuth;
