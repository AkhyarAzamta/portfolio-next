// app/api/admin/blogs/[id]/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { withAdminAuth } from '@/lib/withAdminAuth'

export const GET = withAdminAuth(async (request, ctx) => {
  // handle both ctx.params or Promise<params>
  const params = await Promise.resolve(ctx?.params)
  const id = params?.id ? String(params.id) : null

  if (!id) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  const blog = await prisma.blog.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true, avatar: true } }
    }
  })

  if (!blog) {
    return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
  }

  return NextResponse.json(blog)
})

export const PUT = withAdminAuth(async (request, ctx) => {
  const params = await Promise.resolve(ctx?.params)
  const id = params?.id ? String(params.id) : null
  if (!id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  const body = await request.json()
  const { title, excerpt, content, published, archived } = body ?? {}

  if (!title || !excerpt) {
    return NextResponse.json({ error: 'Title and excerpt are required' }, { status: 400 })
  }

  const updated = await prisma.blog.update({
    where: { id },
    data: { title, excerpt, content, published, archived },
    include: { author: { select: { id: true, name: true, avatar: true } } }
  })

  return NextResponse.json(updated)
})

export const DELETE = withAdminAuth(async (request, ctx) => {
  const params = await Promise.resolve(ctx?.params)
  const id = params?.id ? String(params.id) : null
  if (!id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  await prisma.blog.delete({ where: { id } })
  return NextResponse.json({ message: 'Blog deleted successfully' })
})
