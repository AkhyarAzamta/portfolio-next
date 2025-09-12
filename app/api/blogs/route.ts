// app/api/blogs/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Fungsi untuk menghitung waktu baca berdasarkan jumlah kata
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
    
    // Tambahkan field virtual yang diharapkan oleh frontend
    const blogsWithVirtualFields = blogs.map(blog => ({
      ...blog,
      date: blog.createdAt, // Gunakan createdAt sebagai date
      readTime: calculateReadTime(blog.content) // Hitung waktu baca
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