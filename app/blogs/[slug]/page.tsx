// app/blogs/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { 
  FaCalendarAlt, 
  FaClock, 
  FaUser, 
  FaArrowLeft,
  FaEye
} from 'react-icons/fa'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import ViewCountTracker from './components/ViewCountTracker'
import ShareButtons from './components/ShareButtons'
import RecentPostsSidebar from './components/RecentPostsSidebar'
import RelatedPosts from './components/RelatedPosts'
import { Blog, BlogPost } from '@/types'

import prisma from '@/lib/prisma'

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  // Await the params promise
  const { slug } = await params
  const blog = await getBlogPost(slug)
  
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
      tags: blog.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.excerpt,
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
        published: true
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
      createdAt: blog.createdAt.toISOString(),
      updatedAt: blog.updatedAt.toISOString(),
      content: blog.content || '',
      tags: blog.tags || [],
      viewCount: blog.viewCount || 0
    }
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
}

// Fetch related posts (by tags)
async function getRelatedPosts(currentSlug: string, tags: string[]): Promise<BlogPost[]> {
  try {
    if (tags.length === 0) return []

    const blogs = await prisma.blog.findMany({
      where: { 
        slug: { not: currentSlug },
        published: true,
        tags: {
          hasSome: tags
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 3,
      include: {
        author: {
          select: {
            name: true,
            avatar: true
          }
        }
      }
    })
    
    return blogs.map((blog: Blog) => ({
      ...blog,
      createdAt: blog.createdAt.toString(),
      updatedAt: blog.updatedAt.toString(),
      content: blog.content || '',
      tags: blog.tags || [],
      viewCount: blog.viewCount || 0
    }))
  } catch (error) {
    console.error('Error fetching related posts:', error)
    return []
  }
}

// Fetch recent posts
async function getRecentPosts(excludeSlug: string): Promise<BlogPost[]> {
  try {
    const blogs = await prisma.blog.findMany({
      where: { 
        slug: { not: excludeSlug },
        published: true
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        author: {
          select: {
            name: true,
            avatar: true
          }
        }
      }
    })
    
    return blogs.map((blog: Blog) => ({
      ...blog,
      createdAt: blog.createdAt.toString(),
      updatedAt: blog.updatedAt.toString(),
      content: blog.content || '',
      tags: blog.tags || [],
      viewCount: blog.viewCount || 0
    }))
  } catch (error) {
    console.error('Error fetching recent posts:', error)
    return []
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  // Await the params promise
  const { slug } = await params
  const blog = await getBlogPost(slug)
  const relatedPosts = await getRelatedPosts(slug, blog?.tags || [])
  const recentPosts = await getRecentPosts(slug)
  
  if (!blog) {
    notFound()
  }
  
  const readTime = calculateReadTime(blog.content || '')
  const siteUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

  return (
    <div className="max-w-7xl mx-auto py-8">
      {/* Back button with proper padding */}
      <div className="px-4 lg:px-8">
        <Link 
          href="/blogs"
          className="inline-flex items-center text-primary hover:text-primary/80 mb-8"
        >
          <FaArrowLeft className="mr-2" />
          Back to Blogs
        </Link>
      </div>
      
      <div className="flex flex-col lg:flex-row">
        {/* Main content */}
        <article className="flex-1 px-4 lg:px-8">
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
              <div className="flex items-center">
                <FaEye className="mr-1" />
                {blog.viewCount} views
              </div>
            </div>
          </header>

          <div 
            className="prose prose-lg max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: blog.content || '' }}
          />

          
            {/* Tags */}
            {blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4 mb-8">
                {blog.tags.map(tag => (
                  <span key={tag} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

          {/* Share buttons */}
          <ShareButtons title={blog.title} slug={blog.slug} siteUrl={siteUrl} />

          {/* View count */}
          <div className="text-sm text-gray-500 mb-8">
            Artikel ini dibaca sebanyak <b>{blog.viewCount}</b> kali.
          </div>

          {/* Related articles */}
          <RelatedPosts posts={relatedPosts} />
        </article>

        {/* Sidebar - Now with proper right alignment */}
        <div className="w-full lg:w-80 px-4 lg:px-8 lg:pl-0">
          <RecentPostsSidebar posts={recentPosts} />
        </div>
      </div>
      
      {/* View count tracker */}
      <ViewCountTracker slug={slug} />
    </div>
  )
}