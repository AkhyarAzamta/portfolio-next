// components/Blogs.tsx
'use client'

import { useBlogs } from '@/hooks/useBlogs'
import BlogList from './BlogList'
import { Loading } from './ui/loading'

interface BlogsProps {
  limit?: number
  title?: string
  showViewAll?: boolean
}

export default function Blogs({ limit, title, showViewAll = false }: BlogsProps) {
  const { blogs, loading, error } = useBlogs()

  if (loading) return <Loading size={150} blur="sm" />
  if (error) return <div>Error: {error}</div>

  // Apply limit if provided and filter only published blogs
  const displayedBlogs = (limit ? blogs.slice(0, limit) : blogs).filter((blog: { published: boolean }) =>
    blog.published,
  )

  return (
    <BlogList 
      blogs={displayedBlogs} 
      title={title} 
      showViewAll={showViewAll} 
    />
  )
}