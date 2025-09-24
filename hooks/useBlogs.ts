// hooks/useBlogs.ts
import useSWR from 'swr'
import { Blog } from '@/types'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useBlogs() {
  const { data, error } = useSWR<Blog[]>('/api/blogs', fetcher)

  return {
    blogs: data || [],
    loading: !error && !data,
    error: error
  }
}