// app/blogs/[slug]/components/RecentPostsSidebar.tsx
import Link from 'next/link'
import { FaCalendarAlt } from 'react-icons/fa'
import { BlogPost } from '@/types'

interface RecentPostsSidebarProps {
  posts: BlogPost[]
}

export default function RecentPostsSidebar({ posts }: RecentPostsSidebarProps) {
  if (posts.length === 0) return null

  return (
    <aside className="w-full">
      {/* Removed sticky positioning */}
      <div>
        <h2 className="text-xl font-bold mb-4">Artikel Terbaru</h2>
        <div className="space-y-4">
          {posts.map(post => (
            <Link 
              key={post.id} 
              href={`/blogs/${post.slug}`}
              className="block bg-background p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm"
            >
              <h3 className="font-semibold text-sm mb-1 hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h3>
              <div className="flex items-center text-xs text-gray-500">
                <FaCalendarAlt className="mr-1" />
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  )
}