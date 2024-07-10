import { Response } from "express";
import { Logger } from "@/utils/logger";
import { signToken } from "@admin/utils/jwt.utils";
import { env } from "@/config/env.config";

export const addTokens = (res: Response, id: string, role: string) => {
  try {
    const accessToken = signToken({
      key: "ACCESS_TOKEN_PRIVATE_ADMIN",
      id,
      role,
    });
    const refreshToken = signToken({
      key: "REFRESH_TOKEN_PRIVATE_ADMIN",
      id,
      role,
    });

    if (env.NODE_ENV === "production") {
      res.cookie("accessToken-admin", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        domain: ".triumphify.com",
        path: "/",
        maxAge: 1000 * 60 * 15,
      });
      res.cookie("refreshToken-admin", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        domain: ".triumphify.com",
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 30,
      });
    } else {
      res.cookie("accessToken-admin", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 1000 * 60 * 15,
      });
      res.cookie("refreshToken-admin", refreshToken, {
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
  res.clearCookie("accessToken-admin");
  res.clearCookie("refreshToken-admin");
  return;
};
