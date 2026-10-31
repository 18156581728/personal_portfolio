import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import type { Project, ProjectInput } from "@portfolio/shared";
import { config } from "./config.js";

fs.mkdirSync(path.dirname(config.databasePath), { recursive: true });

export const db = new DatabaseSync(config.databasePath);

db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    repo_url TEXT,
    live_url TEXT,
    tech_stack TEXT NOT NULL DEFAULT '[]',
    cover_url TEXT,
    problem TEXT,
    role TEXT,
    outcome TEXT,
    tags TEXT NOT NULL DEFAULT '[]',
    featured INTEGER NOT NULL DEFAULT 0,
    published INTEGER NOT NULL DEFAULT 1,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_projects_public_order
  ON projects (published, featured DESC, sort_order DESC, created_at DESC);
`);

interface ProjectRow {
  id: string;
  title: string;
  description: string;
  repo_url: string | null;
  live_url: string | null;
  tech_stack: string;
  cover_url: string | null;
  problem: string | null;
  role: string | null;
  outcome: string | null;
  tags: string;
  featured: number;
  published: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

function parseStringArray(value: string): string[] {
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function rowToProject(row: ProjectRow): Project {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    repoUrl: row.repo_url,
    liveUrl: row.live_url,
    techStack: parseStringArray(row.tech_stack),
    coverUrl: row.cover_url,
    problem: row.problem,
    role: row.role,
    outcome: row.outcome,
    tags: parseStringArray(row.tags) as Project["tags"],
    featured: Boolean(row.featured),
    published: Boolean(row.published),
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function getPublishedProjects(): Project[] {
  const rows = db
    .prepare(
      `SELECT * FROM projects
       WHERE published = 1
       ORDER BY featured DESC, sort_order DESC, created_at DESC`,
    )
    .all() as unknown as ProjectRow[];
  return rows.map(rowToProject);
}

export function getAllProjects(): Project[] {
  const rows = db
    .prepare(
      `SELECT * FROM projects
       ORDER BY featured DESC, sort_order DESC, created_at DESC`,
    )
    .all() as unknown as ProjectRow[];
  return rows.map(rowToProject);
}

export function getProjectById(id: string): Project | null {
  const row = db.prepare("SELECT * FROM projects WHERE id = ?").get(id) as
    | ProjectRow
    | undefined;
  return row ? rowToProject(row) : null;
}

export function createProject(id: string, input: ProjectInput): Project {
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO projects (
      id, title, description, repo_url, live_url, tech_stack, cover_url,
      problem, role, outcome, tags, featured, published, sort_order,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    input.title,
    input.description,
    input.repoUrl,
    input.liveUrl,
    JSON.stringify(input.techStack),
    input.coverUrl,
    input.problem,
    input.role,
    input.outcome,
    JSON.stringify(input.tags),
    input.featured ? 1 : 0,
    input.published ? 1 : 0,
    input.sortOrder,
    now,
    now,
  );

  return getProjectById(id)!;
}

export function updateProject(id: string, input: ProjectInput): Project | null {
  const existing = getProjectById(id);
  if (!existing) return null;

  db.prepare(
    `UPDATE projects SET
      title = ?, description = ?, repo_url = ?, live_url = ?,
      tech_stack = ?, cover_url = ?, problem = ?, role = ?,
      outcome = ?, tags = ?, featured = ?, published = ?,
      sort_order = ?, updated_at = ?
    WHERE id = ?`,
  ).run(
    input.title,
    input.description,
    input.repoUrl,
    input.liveUrl,
    JSON.stringify(input.techStack),
    input.coverUrl,
    input.problem,
    input.role,
    input.outcome,
    JSON.stringify(input.tags),
    input.featured ? 1 : 0,
    input.published ? 1 : 0,
    input.sortOrder,
    new Date().toISOString(),
    id,
  );

  return getProjectById(id);
}

const demoProjects: ProjectInput[] = [
  {
    title: "示例 · Agent 工作流编排台",
    description:
      "把工单检索、方案生成与人工确认串成可观测的 Agent 工作流。示例内容，请在管理端替换成你的真实项目。",
    repoUrl: null,
    liveUrl: null,
    techStack: ["TypeScript", "Node.js", "Agent", "RAG", "SQLite"],
    coverUrl: null,
    problem: "人工处理重复工单的上下文收集耗时，且执行过程难以复盘。",
    role: "核心开发 · Agent 编排与后端工具链",
    outcome: "示例占位：填写真实准确率、耗时或人力节省数据。",
    tags: ["agent", "fullstack"],
    featured: true,
    published: true,
    sortOrder: 100,
  },
  {
    title: "示例 · 高并发业务服务",
    description:
      "面向业务增长拆分核心链路，补充缓存、限流与可观测性。示例内容，请替换为真实系统与指标。",
    repoUrl: null,
    liveUrl: null,
    techStack: ["Java", "PostgreSQL", "Redis", "Docker"],
    coverUrl: null,
    problem: "高峰期核心接口延迟波动，故障定位依赖人工串联日志。",
    role: "后端负责人",
    outcome: "示例占位：填写 QPS、P95 延迟与稳定性提升数据。",
    tags: ["backend"],
    featured: true,
    published: true,
    sortOrder: 90,
  },
  {
    title: "示例 · 运营洞察仪表盘",
    description:
      "将复杂业务数据重新组织为可执行的运营视图，兼顾大屏与移动端。示例内容，请替换为真实产品截图。",
    repoUrl: null,
    liveUrl: null,
    techStack: ["Vue 3", "TypeScript", "Tailwind CSS", "ECharts"],
    coverUrl: null,
    problem: "运营团队需要在多个报表间来回切换，才能完成一次判断。",
    role: "前端核心开发",
    outcome: "示例占位：填写页面耗时、任务完成效率等结果。",
    tags: ["frontend"],
    featured: false,
    published: true,
    sortOrder: 80,
  },
  {
    title: "示例 · 内部工具全栈闭环",
    description:
      "从权限、接口到交互完整交付的小型内部工具，强调可维护性与快速迭代。示例内容，请替换真实项目。",
    repoUrl: null,
    liveUrl: null,
    techStack: ["Vue 3", "Node.js", "Express", "SQLite"],
    coverUrl: null,
    problem: "跨团队任务依赖人工同步，状态和数据口径长期不一致。",
    role: "独立开发",
    outcome: "示例占位：填写上线范围、使用人数与节省时间。",
    tags: ["fullstack"],
    featured: false,
    published: true,
    sortOrder: 70,
  },
];

export function seedDemoProjects(): void {
  const count = db.prepare("SELECT COUNT(*) AS count FROM projects").get() as {
    count: number;
  };
  if (count.count > 0) return;

  for (const [index, project] of demoProjects.entries()) {
    createProject(`demo-project-${index + 1}`, project);
  }
}
