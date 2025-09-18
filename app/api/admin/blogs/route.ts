// app/api/admin/blogs/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/jwt'
import { slugify } from '@/utils/slugify'

// GET - Fetch all blogs
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const decoded = await verifyToken(token)
    if (decoded?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const blogs = await prisma.blog.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    })

    return NextResponse.json(blogs)
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    )
  }
}

// POST - Create a new blog
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const decoded = await verifyToken(token)
    if (decoded?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { title, excerpt, content, published, archived } = await request.json()
    
    if (!title || !excerpt) {
      return NextResponse.json(
        { error: 'Title and excerpt are required' },
        { status: 400 }
      )
    }

    // Generate slug from title
    const slug = slugify(title)
    
    // Check if slug already exists
    const existingBlog = await prisma.blog.findUnique({
      where: { slug }
    })

    if (existingBlog) {
      return NextResponse.json(
        { error: 'A blog with this title already exists' },
        { status: 400 }
      )
    }

    const blog = await prisma.blog.create({
      data: {
        title,
        excerpt,
        content,
        slug,
        published: published || false,
        archived: archived || false,
        authorId: decoded.userId // Use the authenticated user's ID
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    })

    return NextResponse.json(blog, { status: 201 })
  } catch (error) {
    console.error('Error creating blog:', error)
    return NextResponse.json(
      { error: 'Failed to create blog' },
      { status: 500 }
    )
  }
}