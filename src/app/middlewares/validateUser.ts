import { TokenPayload, verifyJwt } from "@app/utils/jwt.utils";
import { Logger } from "@/utils/logger";
import { NextFunction, Request, Response } from "express";
import { addTokens, removeTokens } from "@app/entities/auth/utils/auth";

const validateUser = async (
  req: Request<{}, {}, TokenPayload>,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.cookies["accessToken"];
    const refreshToken = req.cookies["refreshToken"];

    if (accessToken) {
      const { decoded, expired, valid } = verifyJwt({
        token: accessToken,
        key: "ACCESS_TOKEN_PUBLIC",
      });

      // Case 1: valid accessToken
      if (valid && !expired && decoded) {
        req.body.token = decoded.token;
        return next();
      }
    }

    if (refreshToken) {
      const { decoded, expired, valid } = verifyJwt({
        token: refreshToken,
        key: "REFRESH_TOKEN_PUBLIC",
      });

      // Case 2: valid refreshToken
      if (valid && !expired && decoded) {
        // refresh token values
        removeTokens(res);
        addTokens(res, decoded.token.id);
        req.body.token = decoded.token;
        return next();
      }
    }

    return res.status(401).send({
      title: "Unauthorized",
      description:
        "You are not authorized to access this resource. Please login",
      type: "error",
    });
  } catch (err) {
    Logger.error("validate Employee error", err);
    return res
      .status(500)
      .send({ description: "Internal server error", type: "error" });
  }
};

export default validateUser;
