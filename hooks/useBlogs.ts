// hooks/useBlogs.ts
import useSWR from 'swr'

export interface Blog {
  id: number
  title: string
  excerpt: string
  content: string | null
  slug: string
  published: boolean
  viewCount: number
  tags: string[]
  createdAt: string
  updatedAt: string
  author: {
    name: string
    avatar: string | null
  }
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useBlogs() {
  const { data, error } = useSWR<Blog[]>('/api/blogs', fetcher)

  return {
    blogs: data || [],
    loading: !error && !data,
    error: error
  }
}