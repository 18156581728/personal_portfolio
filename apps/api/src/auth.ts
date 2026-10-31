import {
  createHash,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import { config } from "./config.js";

const COOKIE_NAME = "portfolio_session";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
const LOGIN_WINDOW_MS = 10 * 60 * 1000;
const MAX_FAILURES = 5;

const sessions = new Map<string, number>();
const loginFailures = new Map<string, { count: number; resetAt: number }>();

const passwordSalt = createHash("sha256")
  .update(config.sessionSecret)
  .update("::portfolio-admin")
  .digest();
const expectedPasswordHash = scryptSync(config.adminPassword, passwordSalt, 64);

setInterval(() => {
  const now = Date.now();
  for (const [token, expiresAt] of sessions) {
    if (expiresAt <= now) sessions.delete(token);
  }
  for (const [ip, entry] of loginFailures) {
    if (entry.resetAt <= now) loginFailures.delete(ip);
  }
}, 15 * 60 * 1000).unref();

function parseCookies(header: string | undefined): Record<string, string> {
  if (!header) return {};
  return Object.fromEntries(
    header.split(";").flatMap((part) => {
      const separator = part.indexOf("=");
      if (separator < 0) return [];
      const key = part.slice(0, separator).trim();
      const value = part.slice(separator + 1).trim();
      return key ? [[key, decodeURIComponent(value)]] : [];
    }),
  );
}

export function verifyPassword(password: string): boolean {
  const supplied = scryptSync(password, passwordSalt, 64);
  return timingSafeEqual(supplied, expectedPasswordHash);
}

export function createSession(res: Response): void {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = Date.now() + SESSION_TTL_MS;
  sessions.set(token, expiresAt);
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_MS,
  });
}

export function clearSession(req: Request, res: Response): void {
  const token = parseCookies(req.headers.cookie)[COOKIE_NAME];
  if (token) sessions.delete(token);
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: "lax",
    path: "/",
  });
}

export function hasValidSession(req: Request): boolean {
  const token = parseCookies(req.headers.cookie)[COOKIE_NAME];
  if (!token) return false;
  const expiresAt = sessions.get(token);
  if (!expiresAt || expiresAt <= Date.now()) {
    sessions.delete(token);
    return false;
  }
  return true;
}

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!hasValidSession(req)) {
    res.status(401).json({ message: "未授权。" });
    return;
  }
  next();
}

export function checkLoginRateLimit(ip: string): boolean {
  const entry = loginFailures.get(ip);
  return !entry || entry.count < MAX_FAILURES || entry.resetAt <= Date.now();
}

export function recordLoginFailure(ip: string): void {
  const now = Date.now();
  const current = loginFailures.get(ip);
  if (!current || current.resetAt <= now) {
    loginFailures.set(ip, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
    return;
  }
  current.count += 1;
}

export function clearLoginFailures(ip: string): void {
  loginFailures.delete(ip);
}
