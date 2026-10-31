import type { ProjectInput, ProjectTag } from "@portfolio/shared";

const allowedTags = new Set<ProjectTag>([
  "agent",
  "backend",
  "frontend",
  "fullstack",
]);

/** 区分用户可以修正的输入错误与服务器/数据库故障。 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

function cleanString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function cleanOptionalString(value: unknown): string | null {
  const cleaned = cleanString(value);
  return cleaned || null;
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function cleanUrl(value: unknown, fieldName: string): string | null {
  const cleaned = cleanOptionalString(value);
  if (cleaned && !isHttpUrl(cleaned)) {
    throw new ValidationError(`${fieldName}必须是合法的 http(s) 地址。`);
  }
  return cleaned;
}

function cleanStringArray(value: unknown, fieldName: string): string[] {
  if (!Array.isArray(value)) {
    throw new ValidationError(`${fieldName}格式不正确。`);
  }
  const items = [...new Set(value.map(cleanString).filter(Boolean))];
  if (items.length > 12) {
    throw new ValidationError(`${fieldName}最多 12 项。`);
  }
  return items;
}

export function parseProjectInput(value: unknown): ProjectInput {
  if (!value || typeof value !== "object") {
    throw new ValidationError("请求内容格式不正确。");
  }
  const body = value as Record<string, unknown>;
  const title = cleanString(body.title);
  const description = cleanString(body.description);
  const techStack = cleanStringArray(body.techStack, "技术栈");
  const rawTags = cleanStringArray(body.tags, "分类");

  if (!title) throw new ValidationError("标题不能为空。");
  if (title.length > 40) throw new ValidationError("标题不能超过 40 个字。");
  if (!description) throw new ValidationError("描述不能为空。");
  if (techStack.length === 0) throw new ValidationError("技术栈至少填写一项。");
  if (rawTags.some((tag) => !allowedTags.has(tag as ProjectTag))) {
    throw new ValidationError("分类包含不支持的选项。");
  }

  const rawSortOrder =
    typeof body.sortOrder === "number" ? body.sortOrder : Number(body.sortOrder);

  return {
    title,
    description,
    repoUrl: cleanUrl(body.repoUrl, "源码地址"),
    liveUrl: cleanUrl(body.liveUrl, "访问地址"),
    techStack,
    coverUrl: cleanUrl(body.coverUrl, "封面地址"),
    problem: cleanOptionalString(body.problem),
    role: cleanOptionalString(body.role),
    outcome: cleanOptionalString(body.outcome),
    tags: rawTags as ProjectTag[],
    featured: body.featured === true,
    published: body.published !== false,
    sortOrder: Number.isFinite(rawSortOrder) ? Math.trunc(rawSortOrder) : 0,
  };
}
