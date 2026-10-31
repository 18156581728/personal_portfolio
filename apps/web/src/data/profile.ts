export interface SocialLink {
  label: string;
  href: string;
  icon: "github" | "mail" | "linkedin";
}

/**
 * 个人内容占位。上线前请把姓名、文案、邮箱和社交链接替换为真实信息。
 * 简历未配置时会自动隐藏入口，避免产生空链接。
 */
export const profile = {
  name: "你的名字",
  englishName: "YOUR NAME",
  role: "全栈工程师 · Backend / Frontend / AI Agent",
  headline:
    "4 年工程经验：把稳定的后端服务、清晰的界面，和可落地的 Agent 工作流做在一起。",
  location: "中国 · 可远程",
  tags: ["4 年开发", "3 年后端", "Agent 实践"],
  about: [
    "主要工作集中在后端业务系统与平台能力：梳理复杂链路、保证接口稳定，并把问题拆到可以交付和验证的粒度。",
    "能独立完成前端产品交付，也重视信息层级、响应式体验与工程可维护性。这个作品集本身也作为前端能力的一次公开验证。",
    "在 Agent 方向关注真实工具链中的规划、调用、边界与评测，而不只是写一条 Prompt。希望把复杂系统讲清楚，也把不完美的地方讲明白。",
  ],
  email: "hello@example.com",
  resumeUrl: "",
  avatarUrl: "",
  socials: [
    { label: "GitHub", href: "https://github.com/", icon: "github" },
    { label: "Email", href: "mailto:hello@example.com", icon: "mail" },
  ] satisfies SocialLink[],
};
