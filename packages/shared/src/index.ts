/** 前后端共用的作品数据结构与表单类型。 */
export type ProjectTag = "agent" | "backend" | "frontend" | "fullstack";

export interface Project {
  id: string;
  title: string;
  description: string;
  repoUrl: string | null;
  liveUrl: string | null;
  techStack: string[];
  coverUrl: string | null;
  problem: string | null;
  role: string | null;
  outcome: string | null;
  tags: ProjectTag[];
  featured: boolean;
  published: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export type ProjectInput = Omit<Project, "id" | "createdAt" | "updatedAt">;

export interface ProjectListResponse {
  projects: Project[];
}

export interface ApiMessage {
  message: string;
}
