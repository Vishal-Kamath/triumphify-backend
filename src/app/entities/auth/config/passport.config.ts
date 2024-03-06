import { Express } from "express";
import { env } from "@/config/env.config";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { v4 as uuid } from "uuid";
import session from "express-session";

export default function initPassport(app: Express) {
  app.use(
    session({
      secret: env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: false,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      },
    })
  );

  app.use(passport.authenticate("session"));
  app.use(passport.initialize());
  app.use(passport.session());

  initGoogle();
}

function initGoogle() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/redirect",
      },
      async (accessToken, refreshToken, profile, done) => {
        if (
          !profile ||
          !profile.id ||
          !profile.displayName ||
          !profile.emails?.length ||
          !profile.photos?.length ||
          !profile.emails[0].value ||
          profile.emails[0]?.verified === undefined
        ) {
          return done(null, false);
        }

        // check user exist
        const userExist = (
          await db
            .select()
            .from(users)
            .where(eq(users.email, profile.emails[0].value))
            .limit(1)
        )[0];

        if (userExist) {
          await db
            .update(users)
            .set({
              googleId: profile.id,
              image: profile.photos[0].value,
            })
            .where(eq(users.email, profile.emails[0].value));
          return done(null, userExist);
        }
        console.log("working");
        // create user
        const id = uuid();
        const newUser = {
          id,
          username: profile.displayName,
          email: profile.emails[0].value,
          emailVerified: String(profile.emails[0].verified) === "true",
          password: "google-auth",
          googleId: profile.id,
          image: profile.photos[0].value,
        };
        await db.insert(users).values(newUser);

        return done(null, newUser);
      }
    )
  );

  // Serialize user into session
  passport.serializeUser<any, any>((user, done: any) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser<any, any>(async (id, done) => {
    try {
      const user = (
        await db.select().from(users).where(eq(users.id, id)).limit(1)
      )[0];
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
}
