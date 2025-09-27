// components/BlogCard.tsx
'use client'

import Link from 'next/link'
import { FaCalendarAlt, FaClock, FaEye } from 'react-icons/fa'
import { Blog } from '@/types'
import Image from 'next/image'
import React from 'react'

interface BlogCardProps {
  blog: Blog
  index?: number
}

export default function BlogCard({ blog }: BlogCardProps) {
  // Calculate read time
  const calculateReadTime = (content: string | null): string => {
    if (!content) return '5 min read'
    const wordsPerMinute = 200
    const words = content.split(/\s+/).length
    const minutes = Math.max(1, Math.ceil(words / wordsPerMinute))
    return `${minutes} min read`
  }

  const truncateExcerpt = (text: string, wordLimit: number) => {
  const words = text.split(/\s+/)
  if (words.length <= wordLimit) return text
  return words.slice(0, wordLimit).join(" ") + "..."
}

  const readTime = calculateReadTime(blog.content || null)

  return (
    <article className="blog-card opacity-0 bg-background rounded-lg shadow-md p-6 h-full flex flex-col transform transition-transform hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/blogs/${blog.slug}`} className="flex flex-col flex-grow">
        {blog.coverImage && (
          <div className="w-full h-40 mb-4 rounded overflow-hidden relative">
            <Image src={blog.coverImage} alt={blog.title} fill className="object-cover w-full h-full" />
          </div>
        )}

        <h3 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">{blog.title}</h3>

        <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
          {truncateExcerpt(blog.excerpt, 15)}
        </p>
      </Link>

      {/* Tags */}
      {blog.tags && blog.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {blog.tags.slice(0, 3).map(tag => (
            <span key={tag} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
              #{tag}
            </span>
          ))}
          {blog.tags.length > 3 && <span className="text-xs text-gray-500">+{blog.tags.length - 3} more</span>}
        </div>
      )}

      <div className="mt-auto">
        <div className="flex items-center mb-3">
          {blog.author?.avatar && (
            <div className="relative w-6 h-6 mr-2 rounded-full overflow-hidden">
              <Image src={blog.author.avatar} alt={blog.author.name} fill className="object-cover" />
            </div>
          )}
          <span className="text-sm text-gray-500">{blog.author?.name}</span>
        </div>

        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
          <span className="flex items-center">
            <FaCalendarAlt className="mr-1" />
            {new Date(blog.createdAt).toLocaleDateString()}
          </span>
          <span className="flex items-center">
            <FaClock className="mr-1" />
            {readTime}
          </span>
          <span className="flex items-center">
            <FaEye className="mr-1" />
            {blog.viewCount || 0}
          </span>
        </div>
      </div>
    </article>
  )
}
