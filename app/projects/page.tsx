// app/projects/page.tsx (Halaman projects - tampilkan semua project)
import Projects from '@/components/Projects'

export default function ProjectsPage() {
  return (
    <Projects 
      title="My Projects" 
      description="Here are some of my recent projects. Click on the links to view the code or live demo."
      layout="grid"
    />
  )
}