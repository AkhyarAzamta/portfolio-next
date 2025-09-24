// app/api/blogs/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Function to calculate read time
function calculateReadTime(content: string | null): string {
  if (!content) return '5 min read'
  
  const wordsPerMinute = 200
  const words = content.split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min read`
}

export async function GET() {
  try {
    const blogs = await prisma.blog.findMany({
      where: {
        published: true,
        archived: false
      },
      orderBy: {
        createdAt: 'desc'
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
    
    // Add virtual fields for frontend
    const blogsWithVirtualFields = blogs.map(blog => ({
      ...blog,
      date: blog.createdAt,
      readTime: calculateReadTime(blog.content),
      viewCount: blog.viewCount || 0,
      tags: blog.tags || []
    }))
    
    return NextResponse.json(blogsWithVirtualFields)
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    )
  }
}