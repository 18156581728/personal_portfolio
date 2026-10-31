export interface Experience {
  id: string;
  start: string;
  end: string;
  title: string;
  company: string;
  companyUrl?: string;
  summary: string;
  techStack: string[];
}

/**
 * 示例经历仅用于验证信息结构与视觉效果。
 * 请根据真实履历改写，并保证结果、技术栈与项目内容一致。
 */
export const experiences: Experience[] = [
  {
    id: "experience-1",
    start: "2023",
    end: "至今",
    title: "后端工程师",
    company: "某互联网公司 · 示例",
    summary:
      "负责核心业务服务与平台能力建设，围绕稳定性、性能和交付效率推进改造。请替换为你的职责、规模和可验证结果。",
    techStack: ["Java", "PostgreSQL", "Redis", "Docker"],
  },
  {
    id: "experience-2",
    start: "2022",
    end: "2023",
    title: "全栈开发",
    company: "早期产品团队 · 示例",
    summary:
      "参与从需求拆解到前后端交付的完整流程，在有限资源下完成多次快速迭代。请替换为真实项目与量化成果。",
    techStack: ["Node.js", "Vue 3", "TypeScript", "SQLite"],
  },
];
