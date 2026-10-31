export interface SkillGroup {
  id: "backend" | "frontend" | "agent" | "engineering";
  title: string;
  items: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    id: "backend",
    title: "Backend",
    items: ["Java", "Go", "Node.js", "PostgreSQL", "Redis", "REST API"],
  },
  {
    id: "frontend",
    title: "Frontend",
    items: ["Vue 3", "TypeScript", "Tailwind CSS", "Vite", "Responsive UI"],
  },
  {
    id: "agent",
    title: "AI Agent",
    items: ["Workflow", "Tool Calling", "RAG", "Evaluation", "Prompt Design"],
  },
  {
    id: "engineering",
    title: "Engineering",
    items: ["Docker", "CI/CD", "Observability", "Performance", "Git"],
  },
];
