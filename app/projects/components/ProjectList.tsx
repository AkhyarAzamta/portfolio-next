'use client'

import React, { useRef, useEffect } from 'react'
import ProjectCard from './ProjectCard'
import Link from 'next/link'
import { Project } from '@/types'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// register plugin only in browser
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface ProjectListProps {
  projects: Project[]
  title?: string
  description?: string
  layout?: 'grid' | 'list'
  showViewAll?: boolean
}

export default function ProjectList({
  projects,
  title = 'Featured Projects',
  description,
  layout = 'grid',
  showViewAll = false
}: ProjectListProps) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const titleRef = useRef<HTMLHeadingElement | null>(null)
  const descRef = useRef<HTMLParagraphElement | null>(null)

  useEffect(() => {
    if (!rootRef.current) return

    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.fromTo(titleRef.current, { opacity: 0, y: 40 }, {
          opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: titleRef.current, start: 'top 85%', toggleActions: 'play none none none' }
        })
      }

      if (descRef.current) {
        gsap.fromTo(descRef.current, { opacity: 0, y: 30 }, {
          opacity: 1, y: 0, duration: 0.6, delay: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: descRef.current, start: 'top 85%', toggleActions: 'play none none none' }
        })
      }

      // Per-card ScrollTrigger
      const cards = gsap.utils.toArray<HTMLElement>('.project-card')

      cards.forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0, y: 25, scale: 0.995 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.0,
            ease: 'power3.out',
            delay: 0.03 * (i % 6),
            scrollTrigger: {
              trigger: card,
              start: 'top 92%',
              toggleActions: 'play reverse play reverse',
              // markers: true // aktifkan saat debug
            }
          })
      })

    }, rootRef)

    // Refresh ScrollTrigger after images loaded (safe checks)
    const imgs = rootRef.current.querySelectorAll<HTMLImageElement>('img')
    const imgLoadPromises: Promise<void>[] = []

    imgs.forEach(img => {
      if (img.complete) {
        // already loaded
        return
      }
      imgLoadPromises.push(new Promise<void>(res => {
        const handler = () => res()
        // addEventListener with { once: true } to auto-remove
        img.addEventListener('load', handler, { once: true })
        // also handle error so promise resolves and doesn't hang
        img.addEventListener('error', handler, { once: true })
      }))
    })

    if (imgLoadPromises.length > 0) {
      Promise.all(imgLoadPromises)
        .then(() => {
          // small delay to allow layout to settle
          setTimeout(() => {
            if (typeof ScrollTrigger !== 'undefined' && typeof ScrollTrigger.refresh === 'function') {
              ScrollTrigger.refresh()
            }
          }, 50)
        })
        .catch(() => {
          // still attempt refresh even on error
          setTimeout(() => {
            if (typeof ScrollTrigger !== 'undefined' && typeof ScrollTrigger.refresh === 'function') {
              ScrollTrigger.refresh()
            }
          }, 50)
        })
    } else {
      // no pending images — still do one refresh safely
      setTimeout(() => {
        if (typeof ScrollTrigger !== 'undefined' && typeof ScrollTrigger.refresh === 'function') {
          ScrollTrigger.refresh()
        }
      }, 50)
    }

    return () => {
      try {
        ctx.revert()
      } catch (e) {
        console.warn('[ProjectList] ctx.revert failed or already reverted', e)
      }
    }
  }, [])

  return (
    <div ref={rootRef} className="container max-w-7xl mx-auto px-4">
      <h2 ref={titleRef} className="text-3xl text-text font-bold mb-6 text-center opacity-0">{title}</h2>

      {description && (
        <p ref={descRef} className="text-lg text-gray-600 dark:text-secondary mb-12 text-center max-w-3xl mx-auto opacity-0">
          {description}
        </p>
      )}

      <div className={`${layout === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3' : 'space-y-8'} gap-8`}>
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} layout={layout} />
        ))}
      </div>

      {showViewAll && (
        <div className="text-center mt-12">
          <div>
            <Link href="/projects" className="inline-block bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors">
              View All Projects
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
