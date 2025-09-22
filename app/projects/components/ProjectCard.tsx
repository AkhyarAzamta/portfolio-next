'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, Github } from 'lucide-react'
import { FaDownload } from 'react-icons/fa'
import { Project } from '@/types'

interface ProjectCardProps {
  project: Project
  index: number
  layout?: 'grid' | 'list'
}

export default function ProjectCard({ project, layout = 'grid' }: ProjectCardProps) {
  // root element MUST have class "project-card opacity-0"
  const rootClass = `project-card opacity-0 ${layout === 'list' ? 'p-6' : ''} bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden`

  if (layout === 'list') {
    return (
      <article className={rootClass}>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <Image
              src={project.image}
              alt={project.title}
              width={400}
              height={250}
              className="rounded-lg object-cover w-full h-48"
            />
          </div>
          <div className="md:w-2/3">
            <h3 className="text-xl font-bold mb-2">{project.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.technologies.map((tech) => (
                <span key={tech} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                  {tech}
                </span>
              ))}
            </div>
            <div className="flex gap-4">
              {project.free ? (
                <Link href={project.githubLink || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  <Github size={20} /> Source Code
                </Link>
              ) : project.sourceCode ? (
                <Link href={project.sourceCode || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  <FaDownload size={20} /> Source Code
                </Link>
              ) : null}

              {project.demoLink && (
                <Link href={project.demoLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  <ExternalLink size={20} /> Live Demo
                </Link>
              )}
            </div>
          </div>
        </div>
      </article>
    )
  }

  // grid layout
  return (
    <article className={rootClass}>
      <Image src={project.image} alt={project.title} width={400} height={250} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{project.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech) => (
            <span key={tech} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
              {tech}
            </span>
          ))}
        </div>
        <div className="flex gap-4">
          {project.free ? (
            <Link href={project.githubLink || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
              <Github size={20} /> Source Code
            </Link>
          ) : project.sourceCode ? (
            <Link href={project.sourceCode || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
              <FaDownload size={20} /> Source Code
            </Link>
          ) : null}

          {project.demoLink && (
            <Link href={project.demoLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
              <ExternalLink size={20} /> Live Demo
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}
