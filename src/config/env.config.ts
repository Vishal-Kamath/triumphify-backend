// import enviroment variables using dotenv
import path from "path";
import * as dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

import { envsafe, port, str } from "envsafe";

export const env = envsafe({
  PORT: port({
    devDefault: 4000,
    desc: "The port the app is running on",
    example: 80,
  }),
  ADMIN_PORT: port({
    devDefault: 4500,
    desc: "The port the admin is running on",
    example: 80,
  }),
  CDN_PORT: port({
    devDefault: 5000,
    desc: "The port the cdn is running on",
    example: 80,
  }),
  WS_PORT: port({
    devDefault: 5500,
    desc: "The port the cdn is running on",
    example: 80,
  }),

  // endpoints
  APP_ENDPOINT: str(),
  ADMIN_ENDPOINT: str(),
  CDN_ENDPOINT: str(),
  WS_ENDPOINT: str(),

  // websites
  WEBSITE: str(),
  APP_WEBSITE: str(),
  ADMIN_WEBSITE: str(),

  NODE_ENV: str({
    devDefault: "development",
    choices: ["development", "production"],
  }),

  // nodemailer
  NODEMAILER_EMAIL: str(),
  NODEMAILER_EMAIL_PASSWORD: str(),

  // courier
  COURIER_AUTH_TOKEN: str(),

  // Drizzle config
  DB_HOST: str(),
  DB_PORT: port(),
  DB_USER: str(),
  DB_PASSWORD: str(),
  DB_DATABASE: str(),

  SESSION_SECRET: str(),
  // Super admin config
  SUPER_ADMIN_EMAIL: str(),
  SUPER_ADMIN_PASSWORD_HASH: str(),

  // Roles
  SUPERADMIN: str(),
  ADMIN: str(),
  EMPLOYEE: str(),

  // Google auth
  GOOGLE_CLIENT_ID: str(),
  GOOGLE_CLIENT_SECRET: str(),

  // JWT
  ACCESS_TOKEN_PRIVATE: str(),
  ACCESS_TOKEN_PUBLIC: str(),

  REFRESH_TOKEN_PRIVATE: str(),
  REFRESH_TOKEN_PUBLIC: str(),

  // JWT Admin
  ACCESS_TOKEN_PRIVATE_ADMIN: str(),
  ACCESS_TOKEN_PUBLIC_ADMIN: str(),

  REFRESH_TOKEN_PRIVATE_ADMIN: str(),
  REFRESH_TOKEN_PUBLIC_ADMIN: str(),

  RESET_TOKEN_PRIVATE: str(),
  RESET_TOKEN_PUBLIC: str(),
});
