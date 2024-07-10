import { Response } from "express";
import { Logger } from "@/utils/logger";
import { signToken } from "@app/utils/jwt.utils";
import { env } from "@/config/env.config";

export const addTokens = (res: Response, id: string) => {
  try {
    const accessToken = signToken({ key: "ACCESS_TOKEN_PRIVATE", id });
    const refreshToken = signToken({ key: "REFRESH_TOKEN_PRIVATE", id });

    if (env.NODE_ENV === "production") {
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        domain: ".triumphify.com",
        path: "/",
        maxAge: 1000 * 60 * 15,
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        domain: ".triumphify.com",
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 30,
      });
    } else {
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 1000 * 60 * 15,
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 30,
      });
    }

    return;
  } catch (err) {
    Logger.error("add tokens error", err);
    return;
  }
};

export const removeTokens = (res: Response) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.clearCookie("connect.sid");
  return;
};
