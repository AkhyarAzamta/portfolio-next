// app/blogs/page.tsx
import Blogs from '@/components/Blogs'

export default function BlogPage() {
  return (
    <div>
      <Blogs 
        title="All Blog Posts" 
        showViewAll={false} 
      />
    </div>
  )
}