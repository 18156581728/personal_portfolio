/** 单个项目的数据结构 */
export interface Project {
  id: string
  title: string
  description: string
  image: string
  techStack: string[]
  /** 项目链接（演示站或仓库） */
  link?: string
}

/** 项目列表，后续可直接在此数组中增删改 */
export const projects: Project[] = [
  {
    id: 'portfolio',
    title: '个人作品集',
    description:
      '使用 React、TypeScript 与 Tailwind CSS 构建的响应式作品集站点，支持深色主题与模块化内容管理。',
    image: '/projects/portfolio.svg',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
    link: 'https://github.com/18156581728/PersonalPortfolio',
  },
  {
    id: 'task-app',
    title: '任务管理应用',
    description:
      '支持任务增删改查、筛选与本地持久化的待办应用，界面简洁，适合日常效率管理。',
    image: '/projects/task-app.svg',
    techStack: ['React', 'Zustand', 'CSS Modules'],
    link: '#',
  },
  {
    id: 'weather-dashboard',
    title: '天气仪表盘',
    description:
      '基于开放 API 的城市天气查询面板，展示实时温度、湿度与多日预报，支持搜索收藏。',
    image: '/projects/weather.svg',
    techStack: ['Vue 3', 'Chart.js', 'REST API'],
    link: '#',
  },
]
