// components/BlogList.tsx
'use client'

import { motion } from 'framer-motion'
import { staggerContainer } from '@/utils/animations'
import BlogCard from './BlogCard'
import { Blog } from '@/hooks/useBlogs'
import Link from 'next/link'

interface BlogListProps {
  blogs: Blog[]
  title?: string
  showViewAll?: boolean
}

export default function BlogList({ blogs, title = "Latest Blog Posts", showViewAll = false }: BlogListProps) {
  return (
    <section className="py-20">
      <div className="container max-w-7xl mx-auto px-4">
        <motion.h2 
          className="text-3xl font-bold mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </motion.h2>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {blogs.map((blog, index) => (
            <BlogCard key={blog.id} blog={blog} index={index} />
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
                href="/blogs"
                className="inline-block bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors"
              >
                View All Posts
              </Link>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  )
}