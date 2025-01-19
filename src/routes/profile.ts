import { Hono } from "hono";
import { getCurrentSession } from "../lib/db/session.js";
import { HTTPException } from "hono/http-exception";

export const profile = new Hono();

profile.use(async (c, next) => {
  const session = await getCurrentSession(c);
  if (!session) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  await next();
});

profile.get("/profile", async (c) => {
  return c.json({ message: "Hello World!" });
});
