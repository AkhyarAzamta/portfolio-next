// app/dashboard/blogs/edit/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import BlogForm from '@/app/blogs/components/BlogForm'
import { Loading } from '@/components/ui/loading'
import { Blog } from '@/types'

export default function EditBlogPage() {
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

  return <BlogForm blog={{ ...blog, content: blog.content ?? '' }} />
}