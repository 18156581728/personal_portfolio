import { randomUUID } from "node:crypto";
import { Router } from "express";
import {
  checkLoginRateLimit,
  clearLoginFailures,
  clearSession,
  createSession,
  hasValidSession,
  recordLoginFailure,
  requireAuth,
  verifyPassword,
} from "./auth.js";
import {
  createProject,
  getAllProjects,
  getPublishedProjects,
  updateProject,
} from "./db.js";
import { parseProjectInput, ValidationError } from "./validation.js";

export const apiRouter = Router();

apiRouter.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

apiRouter.get("/projects", (_req, res) => {
  res.json({ projects: getPublishedProjects() });
});

apiRouter.post("/auth/login", (req, res) => {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  if (!checkLoginRateLimit(ip)) {
    res.status(429).json({ message: "尝试次数过多，请稍后再试。" });
    return;
  }

  const password = typeof req.body?.password === "string" ? req.body.password : "";
  if (!verifyPassword(password)) {
    recordLoginFailure(ip);
    res.status(401).json({ message: "口令不正确。" });
    return;
  }

  clearLoginFailures(ip);
  createSession(res);
  res.json({ authenticated: true });
});

apiRouter.post("/auth/logout", (req, res) => {
  clearSession(req, res);
  res.status(204).end();
});

apiRouter.get("/auth/me", (req, res) => {
  res.json({ authenticated: hasValidSession(req) });
});

apiRouter.get("/admin/projects", requireAuth, (_req, res) => {
  res.json({ projects: getAllProjects() });
});

apiRouter.post("/admin/projects", requireAuth, (req, res, next) => {
  try {
    const input = parseProjectInput(req.body);
    const project = createProject(randomUUID(), input);
    res.status(201).json(project);
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ message: error.message });
      return;
    }
    next(error);
  }
});

apiRouter.put("/admin/projects/:id", requireAuth, (req, res, next) => {
  try {
    const input = parseProjectInput(req.body);
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) {
      res.status(400).json({ message: "作品 ID 无效。" });
      return;
    }
    const project = updateProject(id, input);
    if (!project) {
      res.status(404).json({ message: "作品不存在。" });
      return;
    }
    res.json(project);
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ message: error.message });
      return;
    }
    next(error);
  }
});
