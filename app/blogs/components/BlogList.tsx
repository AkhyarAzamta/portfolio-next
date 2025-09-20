// components/BlogList.tsx
'use client'

import { motion } from 'framer-motion'
import { staggerContainer, fadeInUp } from '@/utils/animations'
import BlogCard from './BlogCard'
import { Blog } from '@/types'
import Link from 'next/link'

interface BlogListProps {
  blogs: Blog[]
  title?: string
  showViewAll?: boolean
}

export default function BlogList({ blogs, title = "Latest Blog Posts", showViewAll = false }: BlogListProps) {
  return (
    <div className="container max-w-7xl mx-auto px-4">
      <motion.h2 
        className="text-3xl font-bold mb-12 text-center"
        {...fadeInUp}
        transition={{ delay: 0.3 }}
      >
        {title}
      </motion.h2>

      {blogs.length === 0 ? (
        <motion.div 
          className="text-center py-12"
          {...fadeInUp}
          transition={{ delay: 0.4 }}
        >
          <p className="text-gray-500">No blog posts available yet.</p>
        </motion.div>
      ) : (
        <>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.4 }}
          >
            {blogs.map((blog, index) => (
              <BlogCard key={blog.id} blog={blog} index={index} />
            ))}
          </motion.div>

          {showViewAll && (
            <motion.div 
              className="text-center mt-12"
              {...fadeInUp}
              transition={{ delay: 0.6 }}
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
        </>
      )}
    </div>
  )
}