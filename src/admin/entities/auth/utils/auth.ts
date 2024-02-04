import { Response } from "express";
import { Logger } from "@/utils/logger";
import { signToken } from "@/utils/jwt.utils";

export const addTokens = (res: Response, id: string) => {
  try {
    const accessToken = signToken("ACCESS_TOKEN_PRIVATE_ADMIN", id);
    const refreshToken = signToken("REFRESH_TOKEN_PRIVATE_ADMIN", id);

    res.cookie("accessToken-admin", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.cookie("refreshToken-admin", refreshToken, {
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
  res.clearCookie("accessToken-admin");
  res.clearCookie("refreshToken-admin");
  return;
};
