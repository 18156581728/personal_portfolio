import type {
  ApiMessage,
  Project,
  ProjectInput,
  ProjectListResponse,
} from "@portfolio/shared";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    ...init,
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as ApiMessage | null;
    throw new ApiError(payload?.message || "请求失败，请稍后重试。", response.status);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export async function fetchPublishedProjects(): Promise<Project[]> {
  const response = await request<ProjectListResponse>("/projects");
  return response.projects;
}

export async function fetchAdminProjects(): Promise<Project[]> {
  const response = await request<ProjectListResponse>("/admin/projects");
  return response.projects;
}

export async function fetchProject(id: string): Promise<Project> {
  const projects = await fetchAdminProjects();
  const project = projects.find((item) => item.id === id);
  if (!project) throw new ApiError("作品不存在。", 404);
  return project;
}

export async function login(password: string): Promise<void> {
  await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ password }),
  });
}

export async function logout(): Promise<void> {
  await request("/auth/logout", { method: "POST" });
}

export async function checkSession(): Promise<boolean> {
  try {
    const response = await request<{ authenticated: boolean }>("/auth/me");
    return response.authenticated;
  } catch {
    return false;
  }
}

export async function createProject(input: ProjectInput): Promise<Project> {
  return request<Project>("/admin/projects", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateProject(
  id: string,
  input: ProjectInput,
): Promise<Project> {
  return request<Project>(`/admin/projects/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}
