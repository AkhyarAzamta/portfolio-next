// components/Blogs.tsx
'use client'

import React from 'react'
import { useBlogs } from '@/hooks/useBlogs'
import BlogList from './BlogList'
import { Loading } from '@/components/ui/loading'

interface BlogsProps {
  limit?: number
  title?: string
  showViewAll?: boolean
}

export default function Blogs({ limit, title, showViewAll = false }: BlogsProps) {
  const { blogs, loading, error } = useBlogs()

  if (loading) return <Loading size={150} blur="sm" />
  if (error) return <div>Error: {error}</div>

  const displayedBlogs = (limit ? blogs.slice(0, limit) : blogs).filter((blog: { published: boolean }) => blog.published)

  return (
    <section className="py-20">
      <BlogList blogs={displayedBlogs} title={title} showViewAll={showViewAll} />
    </section>
  )
}
