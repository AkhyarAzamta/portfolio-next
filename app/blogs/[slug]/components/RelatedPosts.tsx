// app/blogs/[slug]/components/RelatedPosts.tsx
import Link from 'next/link'
import { FaCalendarAlt } from 'react-icons/fa'
import { BlogPost } from '@/types'

interface RelatedPostsProps {
  posts: BlogPost[]
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Artikel Lainnya</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <div key={post.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <Link href={`/blogs/${post.slug}`} className="block">
              <h3 className="font-semibold mb-2 hover:text-primary transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                {post.excerpt}
              </p>
              <div className="flex items-center text-xs text-gray-500">
                <FaCalendarAlt className="mr-1" />
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}