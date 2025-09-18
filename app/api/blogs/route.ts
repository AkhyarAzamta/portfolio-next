// app/api/blogs/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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
        published: true, // Only fetch published blogs
        archived: false // Exclude archived blogs
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
      date: blog.createdAt, // Use createdAt as date
      readTime: calculateReadTime(blog.content) // Calculate read time
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