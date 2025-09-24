'use client'

import React from 'react'
import { useProjects } from '@/hooks/useProjects'
import ProjectList from './components/ProjectList'
import { Loading } from '@/components/ui/loading'

interface ProjectsProps {
  limit?: number
  title?: string
  description?: string
  layout?: 'grid' | 'list'
  showViewAll?: boolean
}

export default function Projects({
  limit,
  title = 'Featured Projects',
  description,
  layout = 'grid',
  showViewAll = false
}: ProjectsProps) {
  const { projects, loading, error } = useProjects()

  if (loading) return <Loading size={150} blur="sm" />
  if (error) return <div>Error: {error}</div>

  const displayedProjects = limit ? projects.slice(0, limit) : projects

  return (
    <section className="py-20">
      <ProjectList
        projects={displayedProjects}
        title={title}
        description={description}
        layout={layout}
        showViewAll={showViewAll}
      />
    </section>
  )
}
