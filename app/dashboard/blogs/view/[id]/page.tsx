// app/dashboard/blogs/view/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FaCalendarAlt, FaClock, FaUser, FaArrowLeft, FaEye, FaEyeSlash, FaEdit } from 'react-icons/fa'
import { Loading } from '@/components/ui/loading'
import Image from 'next/image'
import { Blog } from '@/types'

export default function AdminBlogViewPage() {
  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1]
        const response = await fetch(`/api/admin/blogs/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            router.push('/login')
            return
          }
          throw new Error('Failed to fetch blog')
        }

        const data = await response.json()
        setBlog(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchBlog()
    }
  }, [id, router])

  const togglePublish = async () => {
    if (!blog) return
    
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1]
      const response = await fetch(`/api/admin/blogs/${blog.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          published: !blog.published,
          title: blog.title,
          excerpt: blog.excerpt,
          content: blog.content,
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update blog')
      }

      // Refresh the blog data
      const updatedBlog = await response.json()
      setBlog(updatedBlog)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  if (loading) {
    return <Loading size={150} blur="sm" />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error: {error}</div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="flex items-center justify-center h-64">
        <div>Blog not found</div>
      </div>
    )
  }

  // Calculate read time
  const calculateReadTime = (content: string): string => {
    const wordsPerMinute = 200
    const words = content.split(/\s+/).length
    const minutes = Math.ceil(words / wordsPerMinute)
    return `${minutes} min read`
  }

  const readTime = calculateReadTime(blog.content || '')

  return (
    <div className="container mx-auto px-4 py-8 text-text">
      <div className="flex items-center justify-between mb-6">
        <Button
          onClick={() => router.push('/dashboard/blogs')}
          className="mr-4"
        >
          <FaArrowLeft className="mr-2" />
          Back to Blogs
        </Button>
        
        <div className="flex gap-2">
          <Button
            onClick={() => router.push(`/dashboard/blogs/edit/${blog.id}`)}
          >
            <FaEdit className="mr-2" />
            Edit
          </Button>
          
          <Button
            onClick={togglePublish}
            variant={blog.published ? "secondary" : "default"}
          >
            {blog.published ? (
              <>
                <FaEyeSlash className="mr-2" />
                Unpublish
              </>
            ) : (
              <>
                <FaEye className="mr-2" />
                Publish
              </>
            )}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{blog.title}</CardTitle>
          <CardDescription className="text-lg">{blog.excerpt}</CardDescription>
          
          <div className="flex flex-wrap items-center text-sm dark:text-gray-400 text-gray-500 gap-4 mt-4">
            <div className="flex items-center">
              {blog.author!.avatar && (
                <div className="relative w-6 h-6 mr-2">
                  <Image
                    src={blog.author!.avatar}
                    alt={blog.author!.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
              )}
              <FaUser className="mr-1" />
              {blog.author!.name}
            </div>
            <div className="flex items-center">
              <FaCalendarAlt className="mr-1" />
              {new Date(blog.createdAt).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <FaClock className="mr-1" />
              {readTime}
            </div>
            <div className="flex items-center">
              <span className={`px-2 py-1 rounded-full text-xs ${
                blog.published 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {blog.published ? 'Published' : 'Draft'}
              </span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: blog.content ?? '' }}
          />
        </CardContent>
      </Card>
    </div>
  )
}