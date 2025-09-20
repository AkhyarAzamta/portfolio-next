// components/Projects.tsx
'use client'

import { useProjects } from '@/hooks/useProjects'
import ProjectList from './components/ProjectList'
import { Loading } from '@/components/ui/loading'
import { Project } from '@/types'
import { motion } from 'framer-motion'
import { fadeIn } from '@/utils/animations'

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
    <motion.section
      className="py-20"
      {...fadeIn}
      transition={{ delay: 0.2 }}
    >
      <ProjectList 
        projects={displayedProjects} 
        title={title} 
        description="Here are some of my recent projects. Click on the links to view the code or live demo."
        layout={layout}
        showViewAll={showViewAll}
      />
    </motion.section>
  )
}