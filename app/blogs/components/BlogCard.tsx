// components/BlogCard.tsx
'use client'

import Link from 'next/link'
import { FaCalendarAlt, FaClock, FaEye } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { fadeInUp, cardHoverSmall } from '@/utils/animations'
import { Blog } from '@/hooks/useBlogs'
import Image from 'next/image'

interface BlogCardProps {
  blog: Blog
  index?: number
}

export default function BlogCard({ blog, index = 0 }: BlogCardProps) {
  // Calculate read time
  const calculateReadTime = (content: string | null): string => {
    if (!content) return '5 min read'
    const wordsPerMinute = 200
    const words = content.split(/\s+/).length
    const minutes = Math.ceil(words / wordsPerMinute)
    return `${minutes} min read`
  }

  const readTime = calculateReadTime(blog.content)

  return (
    <motion.article
      className="bg-white dark:bg-dark/50 rounded-lg shadow-md p-6 h-full flex flex-col"
      variants={fadeInUp}
      whileHover={cardHoverSmall.whileHover}
      initial="initial"
      animate="animate"
      transition={{ delay: index * 0.1 }}
    >
      <Link href={`/blogs/${blog.slug}`} className="flex flex-col flex-grow">
        <motion.h3 
          className="text-xl font-semibold mb-2 hover:text-primary transition-colors flex-grow"
          whileHover={{ x: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {blog.title}
        </motion.h3>
      </Link>
      
      <motion.p 
        className="text-gray-600 dark:text-gray-300 mb-4 flex-grow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 + (index * 0.1) }}
      >
        {blog.excerpt}
      </motion.p>
      
      {/* Tags */}
      {blog.tags && blog.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {blog.tags.slice(0, 3).map(tag => (
            <span key={tag} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
              #{tag}
            </span>
          ))}
          {blog.tags.length > 3 && (
            <span className="text-xs text-gray-500">+{blog.tags.length - 3} more</span>
          )}
        </div>
      )}
      
      <div className="mt-auto">
        <div className="flex items-center mb-3">
          {blog.author.avatar && (
            <div className="relative w-6 h-6 mr-2">
              <Image
                src={blog.author.avatar}
                alt={blog.author.name}
                fill
                className="rounded-full object-cover"
              />
            </div>
          )}
          <span className="text-sm text-gray-500">{blog.author.name}</span>
        </div>
        
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
            <FaCalendarAlt className="mr-1" />
            {new Date(blog.createdAt).toLocaleDateString()}
          </motion.span>
          <motion.span 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <FaClock className="mr-1" />
            {readTime}
          </motion.span>
          <motion.span 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <FaEye className="mr-1" />
            {blog.viewCount || 0}
          </motion.span>
        </motion.div>
      </div>
    </motion.article>
  )
}