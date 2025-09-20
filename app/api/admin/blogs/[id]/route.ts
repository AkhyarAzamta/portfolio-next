// app/api/admin/blogs/[id]/route.ts
import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/jwt'

import prisma from '@/lib/prisma'

// Next.js 15: params is a Promise<{ id: string }>
type Context = { params: Promise<{ id: string }> }

function parseId(idStr: unknown): number | null {
  const n = Number(idStr)
  return Number.isInteger(n) && n > 0 ? n : null
}

export async function GET(request: Request, { params }: Context) {
  try {
    // Await the params promise
    const { id } = await params
    const parsedId = parseId(id)
    
    if (!parsedId) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
    }

    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (decoded?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const blog = await prisma.blog.findUnique({
      where: { id: parsedId },
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
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
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

export async function PUT(request: Request, { params }: Context) {
  try {
    // Await the params promise
    const { id } = await params
    const parsedId = parseId(id)
    
    if (!parsedId) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
    }

    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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

    const blog = await prisma.blog.update({
      where: { id: parsedId },
      data: {
        title,
        excerpt,
        content,
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

export async function DELETE(request: Request, { params }: Context) {
  try {
    // Await the params promise
    const { id } = await params
    const parsedId = parseId(id)
    
    if (!parsedId) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
    }

    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (decoded?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.blog.delete({
      where: { id: parsedId }
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