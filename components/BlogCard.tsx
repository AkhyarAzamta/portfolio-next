// components/BlogCard.tsx
'use client'

import Link from 'next/link'
import { FaCalendarAlt, FaClock } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { fadeInUp, cardHoverSmall } from '@/utils/animations'
import { Blog } from '@/hooks/useBlogs'

interface BlogCardProps {
  blog: Blog
  index?: number
}

export default function BlogCard({ blog, index = 0 }: BlogCardProps) {
  return (
    <motion.article
      className="bg-white dark:bg-dark/50 rounded-lg shadow-md p-6"
      variants={fadeInUp}
      whileHover={cardHoverSmall.whileHover}
      initial="initial"
      animate="animate"
      transition={{ delay: index * 0.1 }}
    >
      <Link href={`/blogs/${blog.slug}`}>
        <motion.h3 
          className="text-xl font-semibold mb-2 hover:text-primary transition-colors"
          whileHover={{ x: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {blog.title}
        </motion.h3>
      </Link>
      <motion.p 
        className="text-gray-600 dark:text-gray-300 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 + (index * 0.1) }}
      >
        {blog.excerpt}
      </motion.p>
      <motion.div 
        className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 + (index * 0.1) }}
      >
        <motion.span 
          className="flex items-center"
          whileHover={{ scale: 1.05 }}
        >
          <FaCalendarAlt className="mr-2" />
          {new Date(blog.date).toLocaleDateString()}
        </motion.span>
        <motion.span 
          className="flex items-center"
          whileHover={{ scale: 1.05 }}
        >
          <FaClock className="mr-2" />
          {blog.readTime}
        </motion.span>
      </motion.div>
    </motion.article>
  )
}