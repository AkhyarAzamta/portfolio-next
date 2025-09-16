// app/projects/page.tsx
import ProjectList from "@/components/ProjectList"
import { Project } from "@/types"

export default async function ProjectsPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`, {
    next: { revalidate: 60 }, // regenerate tiap 60 detik
  })
  const projects: Project[] = await res.json()

  return (
    <ProjectList
      projects={projects}
      title="My Projects"
      description="Here are some of my recent projects. Click on the links to view the code or live demo."
      layout="grid"
      showViewAll={false}
    />
  )
}
