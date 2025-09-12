// hooks/useBlogs.ts
import { useState, useEffect } from 'react'

export interface Blog {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  slug: string;
}

export const useBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/blogs')
        if (!response.ok) throw new Error('Failed to fetch blogs')
        const data = await response.json()
        setBlogs(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  return { blogs, loading, error }
}