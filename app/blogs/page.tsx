// app/blogs/page.tsx
import Blogs from '@/app/blogs/components/Blogs'

export default function BlogPage() {
  return (
      <Blogs 
        title="All Blog Posts" 
        showViewAll={false} 
      />
  )
}