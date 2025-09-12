// components/ProjectList.tsx
'use client'

import { motion } from 'framer-motion'
import { staggerContainer } from '@/utils/animations'
import ProjectCard from './ProjectCard'
import { Project } from '@/hooks/useProjects'
import Link from 'next/link'

interface ProjectListProps {
  projects: Project[]
  title?: string
  description?: string
  layout?: 'grid' | 'list'
  showViewAll?: boolean
}

export default function ProjectList({ 
  projects, 
  title = "Featured Projects", 
  description,
  layout = 'grid',
  showViewAll = false
}: ProjectListProps) {
  return (
    <section className="py-20">
      <div className="container max-w-7xl mx-auto px-4">
        <motion.h2 
          className="text-3xl font-bold mb-4 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </motion.h2>
        {description && (
          <motion.p 
            className="text-lg text-secondary mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {description}
          </motion.p>
        )}
        
        <motion.div 
          className={`${layout === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3' : 'space-y-8'} gap-8`}
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {projects.map((project, index) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              index={index}
              layout={layout}
            />
          ))}
        </motion.div>

        {showViewAll && (
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/projects"
                className="inline-block bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors"
              >
                View All Projects
              </Link>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  )
}