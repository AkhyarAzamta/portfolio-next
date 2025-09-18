// app/blogs/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { FaCalendarAlt, FaClock, FaUser, FaArrowLeft } from 'react-icons/fa'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface BlogPost {
  id: number
  title: string
  excerpt: string
  content: string
  slug: string
  published: boolean
  createdAt: string
  updatedAt: string
  author: {
    name: string
    avatar: string | null
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const blog = await getBlogPost(params.slug)
  
  if (!blog) {
    return {
      title: 'Blog Post Not Found'
    }
  }
  
  return {
    title: blog.title,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      type: 'article',
      publishedTime: blog.createdAt,
      authors: [blog.author.name],
    },
  }
}

// Function to calculate read time
function calculateReadTime(content: string): string {
  const wordsPerMinute = 200
  const words = content.split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min read`
}

// Fetch blog post data
async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const blog = await prisma.blog.findUnique({
      where: { 
        slug,
        published: true // Only fetch published blogs
      },
      include: {
        author: {
          select: {
            name: true,
            avatar: true
          }
        }
      }
    })
    
    if (!blog) return null
    
    return {
      ...blog,
      createdAt: blog.createdAt.toISOString(), // Convert Date to string
      updatedAt: blog.updatedAt.toISOString(), // Convert Date to string
      content: blog.content || '', // Ensure content is string, not null
    }
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const blog = await getBlogPost(params.slug)
  
  if (!blog) {
    notFound()
  }
  
  const readTime = calculateReadTime(blog.content || '')

  return (
    <article className="container max-w-4xl mx-auto px-4 py-12">
      <Link 
        href="/blogs"
        className="inline-flex items-center text-primary hover:text-primary/80 mb-8"
      >
        <FaArrowLeft className="mr-2" />
        Back to Blogs
      </Link>
      
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
        <p className="text-xl text-gray-600 mb-6">{blog.excerpt}</p>
        
        <div className="flex flex-wrap items-center text-sm text-gray-500 gap-4">
          <div className="flex items-center">
            {blog.author.avatar && (
              <div className="relative w-8 h-8 mr-2">
                <Image
                  src={blog.author.avatar}
                  alt={blog.author.name}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
            )}
            <FaUser className="mr-1" />
            {blog.author.name}
          </div>
          <div className="flex items-center">
            <FaCalendarAlt className="mr-1" />
            {new Date(blog.createdAt).toLocaleDateString()}
          </div>
          <div className="flex items-center">
            <FaClock className="mr-1" />
            {readTime}
          </div>
        </div>
      </header>

      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.content || '' }}
      />
    </article>
  )
}