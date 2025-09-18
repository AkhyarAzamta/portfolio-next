// app/api/admin/blogs/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/jwt'
import { slugify } from '@/utils/slugify'

// GET - Fetch a single blog
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const decoded = await verifyToken(token)
    if (decoded?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const blog = await prisma.blog.findUnique({
      where: { id: parseInt(params.id) },
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

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(blog)
  } catch (error) {
    console.error('Error fetching blog:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog' },
      { status: 500 }
    )
  }
}

// PUT - Update a blog
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Get the current blog to check if we need to update the slug
    const currentBlog = await prisma.blog.findUnique({
      where: { id: parseInt(params.id) }
    })

    if (!currentBlog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      )
    }

    let slug = currentBlog.slug
    // If title changed, generate new slug
    if (title !== currentBlog.title) {
      slug = slugify(title)
      
      // Check if new slug already exists (excluding current blog)
      const existingBlog = await prisma.blog.findFirst({
        where: {
          slug,
          id: { not: parseInt(params.id) }
        }
      })

      if (existingBlog) {
        return NextResponse.json(
          { error: 'A blog with this title already exists' },
          { status: 400 }
        )
      }
    }

    const blog = await prisma.blog.update({
      where: { id: parseInt(params.id) },
      data: {
        title,
        excerpt,
        content,
        slug,
        published,
        archived
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

    return NextResponse.json(blog)
  } catch (error) {
    console.error('Error updating blog:', error)
    return NextResponse.json(
      { error: 'Failed to update blog' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a blog
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const decoded = await verifyToken(token)
    if (decoded?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.blog.delete({
      where: { id: parseInt(params.id) }
    })

    return NextResponse.json({ message: 'Blog deleted successfully' })
  } catch (error) {
    console.error('Error deleting blog:', error)
    return NextResponse.json(
      { error: 'Failed to delete blog' },
      { status: 500 }
    )
  }
}