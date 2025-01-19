import { serve } from "@hono/node-server";
import "dotenv/config";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";

import { OAuthClient, GithubProvider } from "./lib/oauth/index.js";
import { auth, profile } from "./routes/index.js";

OAuthClient.registerProvider(
  "github",
  new GithubProvider(
    process.env.GITHUB_CLIENT_ID ?? "",
    process.env.GITHUB_CLIENT_SECRET ?? "",
    "http://localhost:3000/login/github/callback"
  )
);

const app = new Hono();

app.use("/*", cors());
app.use("/*", logger());

app.get("/", (c) => c.redirect("/health"));
app.get("/health", (c) => {
  return c.text("OK");
});

app.route("/", auth);
app.route("/", profile);

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  if (err instanceof AggregateError) {
    c.status(500);
    return c.json({ err: err.errors });
  }

  c.status(500);
  return c.json({ message: err.message, cause: err.cause });
});

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
