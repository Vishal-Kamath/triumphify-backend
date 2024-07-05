import { env } from "@/config/env.config";
import jwt from "jsonwebtoken";

export type TokenPayload = {
  token: {
    id: string;
    role: string;
  };
};

export const signToken = ({
  key,
  id,
  role,
}: {
  key:
    | "ACCESS_TOKEN_PRIVATE_ADMIN"
    | "REFRESH_TOKEN_PRIVATE_ADMIN"
    | "ACCESS_TOKEN_PRIVATE"
    | "REFRESH_TOKEN_PRIVATE";
  role: string;
  id: string;
}) => {
  const token_private_key = env[key];
  if (!token_private_key) throw Error(`${key} private secret not found`);

  const payload: TokenPayload = {
    token: {
      id,
      role,
    },
  };

  const expiresIn = key === "ACCESS_TOKEN_PRIVATE_ADMIN" ? "15m" : "30d";

  const token = jwt.sign(payload, token_private_key, {
    algorithm: "RS256",
    expiresIn,
  });

  return token;
};

export function verifyJwt({
  key,
  token,
}: {
  token: string;
  key:
    | "ACCESS_TOKEN_PUBLIC_ADMIN"
    | "REFRESH_TOKEN_PUBLIC_ADMIN"
    | "ACCESS_TOKEN_PUBLIC"
    | "REFRESH_TOKEN_PUBLIC";
}) {
  const token_public_key = env[key];
  if (!token_public_key) throw Error(`${key} public secret not found`);

  try {
    const decoded = jwt.verify(token, token_public_key) as TokenPayload;
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (err: any) {
    return {
      valid: false,
      expired: err.message === "jwt expired",
      decoded: null,
    };
  }
}
