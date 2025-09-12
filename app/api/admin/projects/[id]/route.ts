// app/api/admin/projects/[id]/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/jwt'

type Context = { params: Promise<{ id: string }> } // note: params is a Promise-like in Next 15

function parseId(idStr: unknown) {
  const n = Number(idStr)
  return Number.isInteger(n) && n > 0 ? n : null
}

export async function GET(request: Request, ctx: Context) {
  try {
    // await params first (important in Next 15+)
    const params = await ctx.params
    const id = parseId(params.id)
    if (!id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

    // verify token
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const decoded = await verifyToken(token)
    if (decoded?.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const project = await prisma.project.findUnique({ where: { id } })
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request, ctx: Context) {
  try {
    const params = await ctx.params
    const id = parseId(params.id)
    if (!id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const decoded = await verifyToken(token)
    if (decoded?.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await request.json()
    const {
      title,
      description,
      technologies,
      githubLink,
      demoLink,
      image,
      freeToUse,
      featured
    } = body

    const project = await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
        technologies,
        githubLink,
        demoLink,
        image,
        freeToUse,
        featured
      }
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request, ctx: Context) {
  try {
    const params = await ctx.params
    const id = parseId(params.id)
    if (!id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const decoded = await verifyToken(token)
    if (decoded?.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    await prisma.project.delete({ where: { id } })
    return NextResponse.json({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
