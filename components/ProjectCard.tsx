// components/ProjectCard.tsx
'use client'

import Image from 'next/image'
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { fadeInUp, cardHoverSmall } from '@/utils/animations'
import { Project } from '@/hooks/useProjects'

interface ProjectCardProps {
  project: Project
  index?: number
  layout?: 'grid' | 'list' // Untuk fleksibilitas layout
}

export default function ProjectCard({ project, index = 0, layout = 'grid' }: ProjectCardProps) {
  return (
    <motion.article
      className={`bg-white dark:bg-dark/50 rounded-lg shadow-md overflow-hidden ${
        layout === 'list' ? 'flex flex-col md:flex-row' : ''
      }`}
      variants={fadeInUp}
      whileHover={cardHoverSmall.whileHover}
      initial="initial"
      animate="animate"
      transition={{ delay: index * 0.1 }}
    >
      <motion.div 
        className={`aspect-video bg-gray-200 dark:bg-gray-800 ${
          layout === 'list' ? 'md:w-1/3' : ''
        }`}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Image
          src={project.image}
          alt={project.title}
          className="object-cover w-full h-full"
          width={500}
          height={500}
        />
      </motion.div>
      
      <div className={`p-6 ${layout === 'list' ? 'md:w-2/3' : ''}`}>
        <motion.h3 
          className="text-xl font-semibold mb-2"
          whileHover={{ x: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {project.title}
        </motion.h3>
        <motion.p 
          className="text-secondary mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 + (index * 0.1) }}
        >
          {project.description}
        </motion.p>
        <motion.div 
          className="flex flex-wrap gap-2 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 + (index * 0.1) }}
        >
          {project.technologies.map((tech, techIndex) => (
            <motion.span
              key={techIndex}
              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {tech}
            </motion.span>
          ))}
        </motion.div>
        <motion.div 
          className="flex gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 + (index * 0.1) }}
        >
          {project.freeToUse && (
          <motion.a
            href={project.githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-secondary hover:text-primary transition-colors"
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaGithub className="h-5 w-5" />
            <span>Code</span>
          </motion.a>
          )}
          <motion.a
            href={project.demoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-secondary hover:text-primary transition-colors"
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaExternalLinkAlt className="h-5 w-5" />
            <span>Live Demo</span>
          </motion.a>
        </motion.div>
      </div>
    </motion.article>
  )
}