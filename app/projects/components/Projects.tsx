// components/Projects.tsx
'use client'

import { useProjects } from '@/hooks/useProjects'
import ProjectList from './ProjectList'
import { Loading } from '@/components/ui/loading'
import { Project } from '@/types'

interface ProjectsProps {
  limit?: number
  title?: string
  description?: string
  layout?: 'grid' | 'list'
  showViewAll?: boolean
}

export default function Projects({ 
  limit, 
  title, 
  description, 
  layout = 'grid',
  showViewAll = false 
}: ProjectsProps) {
  const { projects, loading, error } = useProjects()

  if (loading) return <Loading size={150} blur="sm" />
  if (error) return <div>Error: {error}</div>

  // Apply limit if provided
  const displayedProjects: Project[] = limit 
    ? projects.slice(0, limit) 
    : projects

  return (
    <ProjectList 
      projects={displayedProjects} 
      title={title} 
      description={description}
      layout={layout}
      showViewAll={showViewAll}
    />
  )
}
