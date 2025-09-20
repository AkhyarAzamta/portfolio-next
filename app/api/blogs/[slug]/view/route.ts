// app/api/blogs/[slug]/view/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Await the params promise
    const { slug } = await params

    // Increment the view count
    const blog = await prisma.blog.update({
      where: { slug },
      data: {
        viewCount: {
          increment: 1
        }
      }
    })

    return NextResponse.json({ viewCount: blog.viewCount })
  } catch (error) {
    console.error('Error incrementing view count:', error)
    return NextResponse.json(
      { error: 'Failed to increment view count' },
      { status: 500 }
    )
  }
}