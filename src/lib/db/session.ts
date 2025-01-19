import type { Context } from "hono";
import sql from "./db.js";
import crypto from "node:crypto";
import { getCookie } from "hono/cookie";

export type Session = {
  id: string;
  user_id: number;
  expires: Date;
};

const SESSION_EXPIRY_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const EXPIRY_EXTENSION_THRESHOLD_MS = 15 * 24 * 60 * 60 * 1000; // 15 days

export async function createSession(token: string, id: string) {
  const sessionId = hashSessionToken(token);
  const session = {
    id: sessionId,
    user_id: id,
    expires: new Date(Date.now() + SESSION_EXPIRY_MS), // 30 minutes
  };


  await sql<Session[]>`
    insert into session
      (id, user_id, expires)
    values
      (${session.id}, ${session.user_id}, ${session.expires})
  `;

  return session;
}

export async function getCurrentSession(c: Context) {
  const token = getCookie(c, "session");
  if (!token) return null;

  return validateSession(token);
}

async function validateSession(token: string) {
  const sessionId = hashSessionToken(token);
  const [session] = await sql<Session[]>`
    select
      id, user_id as "userId", expires
    from session
    where id = ${sessionId}
  `;

  if (!session) return null;

  if (Date.now() >= session.expires.getTime()) {
    await deleteSession(sessionId);
    return null;
  }

  if (Date.now() >= session.expires.getTime() - EXPIRY_EXTENSION_THRESHOLD_MS) {
    session.expires = new Date(Date.now() + SESSION_EXPIRY_MS);
    await sql<Session[]>`
      update session
      set expires = ${session.expires}
      where id = ${sessionId}
    `;
  }

  return session;
}

export async function deleteSession(sessionId: string) {
  await sql`
    delete from session
    where id = ${sessionId}
  `;
}

export function generateSessionToken() {
  const randomValues = crypto.getRandomValues(new Uint8Array(20));
  return Buffer.from(randomValues).toString("base64url");
}

function hashSessionToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
