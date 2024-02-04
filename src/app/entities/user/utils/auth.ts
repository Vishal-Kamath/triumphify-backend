import { Response } from "express";
import { Logger } from "@/utils/logger";
import { signToken } from "@/utils/jwt.utils";

export const addTokens = (res: Response, id: string) => {
  try {
    const accessToken = signToken("ACCESS_TOKEN_PRIVATE", id);
    const refreshToken = signToken("REFRESH_TOKEN_PRIVATE", id);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return;
  } catch (err) {
    Logger.error("add tokens error", err);
    return;
  }
};

export const removeTokens = (res: Response) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return;
};
