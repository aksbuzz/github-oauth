import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import crypto from "node:crypto";

import {
  FetchError,
  OAuthClient,
  ProviderNotFoundError,
} from "../lib/oauth/index.js";
import { createUser, getUser } from "../lib/db/user.js";
import { createSession, generateSessionToken } from "../lib/db/session.js";

export const auth = new Hono();

auth.get("/login/:provider", async (c) => {
  const provider = c.req.param("provider");
  const state = generateOauthState();

  try {
    const oAuthProvider = OAuthClient.getProvider(provider);
    const authorizationURL = oAuthProvider.getAuthorizationURL(state, [
      "user:email",
    ]);

    setCookie(c, `${provider}_oauth_state`, state, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 10,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return c.redirect(authorizationURL);
  } catch (error) {
    if (error instanceof ProviderNotFoundError) {
      throw new HTTPException(404, { message: error.message });
    }

    throw new HTTPException(400, { message: "Unknown error", cause: error });
  }
});

auth.get("/login/:provider/callback", async (c) => {
  const provider = c.req.param("provider");
  const { code, state } = c.req.query();

  const stateInCookie = getCookie(c, `${provider}_oauth_state`);

  if (!state || !code || !stateInCookie) {
    throw new HTTPException(400, { message: "Invalid request" });
  }

  if (state !== stateInCookie) {
    throw new HTTPException(400, { message: "Invalid state" });
  }

  try {
    const oAuthProvider = OAuthClient.getProvider(provider);
    const accessToken = await oAuthProvider.exchangeCodeForToken(code);
    const userInfo = await oAuthProvider.getUserInfo(accessToken);

    let id; // user_id
    const existingUser = await getUser(userInfo.id);
    if (existingUser) {
      id = existingUser.id;
    } else {
      id = await createUser({
        userId: userInfo.id,
        email: userInfo.email,
        username: userInfo.login,
        accessToken,
      });
    }

    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, id);

    setCookie(c, "session", sessionToken, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: session.expires,
    });

    return c.redirect("/profile");
  } catch (error) {
    if (error instanceof ProviderNotFoundError) {
      throw new HTTPException(404, { message: error.message });
    }
    if (error instanceof FetchError) {
      throw new HTTPException(500, { message: error.message });
    }

    throw new HTTPException(400, { message: "Unknown error", cause: error });
  }
});

function generateOauthState() {
  const bytes = crypto.getRandomValues(new Uint8Array(20));
  return Buffer.from(bytes).toString("base64url");
}
