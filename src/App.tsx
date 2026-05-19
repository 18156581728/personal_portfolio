import Hero from './components/Hero.tsx'
import Projects from './components/Projects.tsx'
import { projects } from './data/projects.ts'

function App() {
  return (
    <main>
      <Hero
        title="你的名字"
        intro="一名热爱前端与设计的开发者，专注于用 React 与 TypeScript 构建简洁、高性能的 Web 体验。"
        avatarSrc="/avatar.svg"
        avatarAlt="个人头像"
      />
      <Projects items={projects} />
    </main>
  )
}

export default App
