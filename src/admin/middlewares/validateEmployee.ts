import { TokenPayload, verifyJwt } from "@admin/utils/jwt.utils";
import { Logger } from "@/utils/logger";
import { NextFunction, Request, Response } from "express";
import { addTokens, removeTokens } from "@admin/entities/auth/utils/auth";
import { db } from "@/lib/db";
import { employee } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

const validateEmployee = async (
  req: Request<{}, {}, TokenPayload>,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.cookies["accessToken-admin"];
    const refreshToken = req.cookies["refreshToken-admin"];

    if (accessToken) {
      const { decoded, expired, valid } = verifyJwt({
        token: accessToken,
        key: "ACCESS_TOKEN_PUBLIC_ADMIN",
      });

      // Case 1: valid accessToken
      if (valid && !expired && decoded) {
        req.body.token = decoded.token;

        // get is deactivated
        // if (await getIsDeactive(decoded.token.id))
        //   return res.status(401).send({
        //     title: "Unauthorized",
        //     description:
        //       "You are not authorized to access this resource. Please login",
        //     type: "error",
        //   });
        return next();
      }
    }

    if (refreshToken) {
      const { decoded, expired, valid } = verifyJwt({
        token: refreshToken,
        key: "REFRESH_TOKEN_PUBLIC_ADMIN",
      });

      // Case 2: valid refreshToken
      if (valid && !expired && decoded) {
        // refresh token values
        removeTokens(res);
        addTokens(res, decoded.token.id, decoded.token.role);
        req.body.token = decoded.token;

        // get is deactivated
        // if (await getIsDeactive(decoded.token.id))
        //   return res.status(401).send({
        //     title: "Unauthorized",
        //     description:
        //       "You are not authorized to access this resource. Please login",
        //     type: "error",
        //   });

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

export default validateEmployee;

async function getIsDeactive(employeeId: string) {
  const user = (
    await db
      .select()
      .from(employee)
      .where(and(eq(employee.id, employeeId), eq(employee.status, "active")))
      .limit(1)
  )[0];
  return !!user;
}
