import type { Project } from '../data/projects.ts'

export interface ProjectsProps {
  /** 项目列表数据 */
  items: Project[]
  /** 区块标题 */
  title?: string
  /** 区块副标题 */
  subtitle?: string
}

/**
 * 项目展示：卡片列表，含截图、标题、描述与技术栈标签
 */
export default function Projects({
  items,
  title = '项目展示',
  subtitle = '精选作品与练习项目',
}: ProjectsProps) {
  return (
    <section id="projects" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        {/* 区块标题 */}
        <div className="mb-14 text-center">
          <h2 className="bg-gradient-to-r from-accent-from to-accent-to bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-foreground/60">{subtitle}</p>
          <div className="mx-auto mt-6 h-1 w-12 rounded-full bg-gradient-to-r from-accent-from to-accent-to" />
        </div>

        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((project) => (
            <li key={project.id}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/** 单个项目卡片 */
function ProjectCard({ project }: { project: Project }) {
  const { title, description, image, techStack, link } = project

  const cardContent = (
    <>
      {/* 项目截图 */}
      <div className="relative aspect-video overflow-hidden bg-foreground/5">
        <img
          src={image}
          alt={`${title} 项目截图`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-foreground/65">
          {description}
        </p>

        {/* 技术栈标签 */}
        <ul className="mt-4 flex flex-wrap gap-2">
          {techStack.map((tech) => (
            <li key={tech}>
              <span className="rounded-full border border-accent-from/30 bg-accent-from/10 px-3 py-1 text-xs font-medium text-foreground/90">
                {tech}
              </span>
            </li>
          ))}
        </ul>

        {link && link !== '#' && (
          <span className="mt-4 inline-flex items-center text-sm font-medium text-accent-from transition-colors group-hover:text-accent-to">
            查看项目 →
          </span>
        )}
      </div>
    </>
  )

  const cardClassName =
    'group flex h-full flex-col overflow-hidden rounded-xl border border-foreground/10 bg-foreground/[0.03] transition-colors duration-300 hover:border-accent-from/40 hover:bg-foreground/[0.06]'

  if (link && link !== '#') {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className={cardClassName}
      >
        {cardContent}
      </a>
    )
  }

  return <article className={cardClassName}>{cardContent}</article>
}
