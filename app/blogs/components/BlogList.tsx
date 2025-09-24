// components/BlogList.tsx
'use client'

import React, { useRef, useEffect } from 'react'
import BlogCard from './BlogCard'
import Link from 'next/link'
import { Blog } from '@/types'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// register plugin only in browser
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface BlogListProps {
  blogs: Blog[]
  title?: string
  showViewAll?: boolean
}

export default function BlogList({ blogs, title = 'Latest Blog Posts', showViewAll = false }: BlogListProps) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const titleRef = useRef<HTMLHeadingElement | null>(null)

  useEffect(() => {
    if (!rootRef.current) return

    const ctx = gsap.context(() => {
      // title reveal
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: titleRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          })
      }

      // Per-card ScrollTrigger: each .blog-card triggers individually
      const cards = gsap.utils.toArray<HTMLElement>('.blog-card')

      cards.forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0, y: 30, scale: 0.995 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9, // adjust duration here
            ease: 'power3.out',
            delay: 0.03 * (i % 6),
            scrollTrigger: {
              trigger: card,
              start: 'top 92%',
              toggleActions: 'play reverse play reverse',
              // markers: true, // uncomment to debug trigger positions
            }
          })
      })
    }, rootRef)

    // Safe refresh after images load
    const imgs = rootRef.current.querySelectorAll<HTMLImageElement>('img')
    const imgPromises: Promise<void>[] = []

    imgs.forEach(img => {
      if (img.complete) return
      imgPromises.push(new Promise<void>(res => {
        const handler = () => res()
        img.addEventListener('load', handler, { once: true })
        img.addEventListener('error', handler, { once: true })
      }))
    })

    if (imgPromises.length > 0) {
      Promise.all(imgPromises)
        .then(() => {
          setTimeout(() => {
            if (typeof ScrollTrigger !== 'undefined' && typeof ScrollTrigger.refresh === 'function') {
              ScrollTrigger.refresh()
            }
          }, 50)
        })
        .catch(() => {
          setTimeout(() => {
            if (typeof ScrollTrigger !== 'undefined' && typeof ScrollTrigger.refresh === 'function') {
              ScrollTrigger.refresh()
            }
          }, 50)
        })
    } else {
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
        console.warn('[BlogList] ctx.revert failed', e)
      }
    }
  }, [])

  return (
    <div ref={rootRef} className="container max-w-7xl mx-auto px-4">
      <h2 ref={titleRef} className="text-3xl font-bold mb-12 text-center opacity-0">{title}</h2>

      {blogs.length === 0 ? (
        <div className="text-center py-12 opacity-0">
          <p className="text-gray-500">No blog posts available yet.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, index) => (
              <BlogCard key={blog.id} blog={blog} index={index} />
            ))}
          </div>

          {showViewAll && (
            <div className="text-center mt-12">
              <div>
                <Link
                  href="/blogs"
                  className="inline-block bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  View All Posts
                </Link>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
