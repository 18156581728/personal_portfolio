export interface HeroProps {
  /** 主标题 */
  title: string
  /** 简介文案 */
  intro: string
  /** 头像图片地址 */
  avatarSrc: string
  /** 头像 alt 描述 */
  avatarAlt?: string
}

/**
 * 首页 Hero：大标题、简介与头像
 */
export default function Hero({
  title,
  intro,
  avatarSrc,
  avatarAlt = '头像',
}: HeroProps) {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-20"
    >
      {/* 背景渐变光晕 */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/4 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-accent-from/20 blur-3xl sm:h-96 sm:w-96"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 bottom-1/4 h-64 w-64 rounded-full bg-accent-to/15 blur-3xl"
      />

      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center gap-10 text-center sm:flex-row sm:items-center sm:gap-14 sm:text-left">
        {/* 头像：渐变描边环 */}
        <div className="shrink-0">
          <div className="rounded-full bg-gradient-to-br from-accent-from to-accent-to p-1 shadow-lg shadow-accent-from/25">
            <img
              src={avatarSrc}
              alt={avatarAlt}
              loading="lazy"
              width={160}
              height={160}
              className="h-36 w-36 rounded-full border-4 border-background object-cover sm:h-40 sm:w-40"
            />
          </div>
        </div>

        <div className="flex-1">
          <p className="mb-3 text-sm font-medium tracking-widest text-foreground/50 uppercase">
            Hello, I&apos;m
          </p>
          <h1 className="bg-gradient-to-r from-accent-from via-purple-400 to-accent-to bg-clip-text text-4xl leading-tight font-bold text-transparent sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-foreground/70 sm:text-lg">
            {intro}
          </p>
          <div className="mx-auto mt-8 h-1 w-16 rounded-full bg-gradient-to-r from-accent-from to-accent-to sm:mx-0" />
        </div>
      </div>
    </section>
  )
}
