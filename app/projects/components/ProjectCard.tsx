'use client'

import Image from 'next/image'
import { FaDownload, FaExternalLinkAlt } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { fadeInUp, cardHoverSmall } from '@/utils/animations'
import { Project } from '@/types'

interface ProjectCardProps {
  project: Project
  index?: number
  layout?: 'grid' | 'list'
}

export default function ProjectCard({ project, index = 0, layout = 'grid' }: ProjectCardProps) {
  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error('Download failed')
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error('Download error:', error)
      window.open(url, '_blank')
    }
  }

  return (
    <motion.article
      className={`bg-white dark:bg-dark/50 rounded-lg shadow-md overflow-hidden flex flex-col h-full ${
        layout === 'list' ? 'md:flex-row' : ''
      }`}
      variants={fadeInUp}
      whileHover={cardHoverSmall.whileHover}
      initial="initial"
      animate="animate"
      transition={{ delay: index * 0.1 }}
    >
      {/* Image: fixed-height for grid, responsive for list */}
      <motion.div
        className={
          layout === 'list'
            ? 'md:basis-1/3 md:h-auto bg-gray-200 dark:bg-gray-800'
            : 'h-48 md:h-56 lg:h-64 bg-gray-200 dark:bg-gray-800'
        }
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {/* Use fill if parent has position relative, but here we use fixed height so width/height props OK */}
        <Image
          src={project.image || '/placeholder-image.jpg'}
          alt={project.title}
          className="object-cover w-full h-full"
          width={800}
          height={600}
          sizes={layout === 'list' ? '(max-width: 768px) 100vw, 33vw' : '(max-width: 768px) 100vw, 33vw'}
        />
      </motion.div>

      {/* Content: flex column so actions can be pushed to bottom */}
      <div className={`p-6 flex flex-col flex-1 ${layout === 'list' ? 'md:basis-2/3' : ''}`}>
        <motion.h3
          className="text-xl font-semibold mb-2"
          whileHover={{ x: 5 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {project.title}
        </motion.h3>

        <motion.p
          className="text-secondary mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 + index * 0.1 }}
        >
          {project.description}
        </motion.p>

        <motion.div
          className="flex flex-wrap gap-2 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 + index * 0.1 }}
        >
          {project.technologies.map((tech, techIndex) => (
            <motion.span
              key={techIndex}
              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tech}
            </motion.span>
          ))}
        </motion.div>

        {/* ACTIONS pindah ke paling bawah */}
        <motion.div
          className="flex gap-4 mt-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 + index * 0.1 }}
        >
          {project.sourceCode && (
            <motion.button
              onClick={() =>
                handleDownload(
                  project.sourceCode!,
                  `${project.title.replace(/\s+/g, '-').toLowerCase()}.zip`
                )
              }
              className="flex items-center gap-2 text-secondary hover:text-primary transition-colors"
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaDownload className="h-5 w-5" />
              <span>Download Source</span>
            </motion.button>
          )}

          {project.demoLink && (
            <motion.a
              href={project.demoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-secondary hover:text-primary transition-colors"
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaExternalLinkAlt className="h-5 w-5" />
              <span>Live Demo</span>
            </motion.a>
          )}
        </motion.div>
      </div>
    </motion.article>
  )
}
