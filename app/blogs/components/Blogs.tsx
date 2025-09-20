// components/Blogs.tsx
'use client'

import { useBlogs } from '@/hooks/useBlogs'
import BlogList from './BlogList'
import { Loading } from '@/components/ui/loading'
import { motion } from 'framer-motion'
import { fadeIn } from '@/utils/animations'

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
    <motion.section
      className="py-20"
      {...fadeIn}
      transition={{ delay: 0.2 }}
    >
      <BlogList 
        blogs={displayedBlogs} 
        title={title} 
        showViewAll={showViewAll} 
      />
    </motion.section>
  )
}