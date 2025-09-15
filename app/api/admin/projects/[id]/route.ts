// app/api/admin/projects/[id]/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/jwt'

// Next.js 15: params berupa Promise<{ id: string }>
type Context = { params: Promise<{ id: string }> }

export async function GET(request: Request, ctx: Context) {
  try {
    const params = await ctx.params
    const id = params.id

    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (decoded?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const prismaProject = await prisma.project.findUnique({
      where: { id }
    })

    if (!prismaProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const project = {
      ...prismaProject,
      technologies: prismaProject.technologies ?? [],
      sourceCode: prismaProject.sourceCode ?? null,
      demoLink: prismaProject.demoLink ?? null,
      price: prismaProject.price ?? null,
      githubLink: prismaProject.githubLink ?? null,
      env: prismaProject.env ?? null,
      password: prismaProject.password ?? null,
      createdAt: prismaProject.createdAt.toISOString(),
      updatedAt: prismaProject.updatedAt.toISOString()
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request, ctx: Context) {
  try {
    const params = await ctx.params
    const id = params.id

    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (decoded?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const raw = (await request.json()) as unknown
    const body = (raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {})

    // Validate required fields and coerce types
    const title = typeof body.title === 'string' ? body.title.trim() : undefined
    const description = typeof body.description === 'string' ? body.description.trim() : undefined

    // technologies can be array or CSV string
    let technologies: string[] | undefined = undefined
    const techRaw = body.technologies
    if (Array.isArray(techRaw)) {
      technologies = techRaw.map((item) => String(item).trim()).filter(Boolean)
    } else if (typeof techRaw === 'string') {
      technologies = techRaw.split(',').map((s: string) => s.trim()).filter(Boolean)
    }

    const image = typeof body.image === 'string' ? body.image : undefined
    const sourceCode = typeof body.sourceCode === 'string' ? body.sourceCode : null
    const demoLink = typeof body.demoLink === 'string' ? body.demoLink : null
    const githubLink = typeof body.githubLink === 'string' ? body.githubLink : null
    const env = typeof body.env === 'string' ? body.env : null
    const password = typeof body.password === 'string' ? body.password : null

    // price might be number or numeric string
    let price: number | null | undefined = undefined
    if (typeof body.price === 'number') price = body.price
    else if (typeof body.price === 'string' && body.price.trim() !== '') {
      const parsed = Number(body.price)
      price = Number.isFinite(parsed) ? parsed : null
    } else if (body.price === null) {
      price = null
    }

    const archived = typeof body.archived === 'boolean' ? body.archived : undefined

    const updatedPrismaProject = await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
        technologies,
        sourceCode,
        demoLink,
        image,
        price,
        archived,
        githubLink,
        env,
        password
      }
    })

    const updatedProject = {
      ...updatedPrismaProject,
      technologies: updatedPrismaProject.technologies ?? [],
      sourceCode: updatedPrismaProject.sourceCode ?? null,
      demoLink: updatedPrismaProject.demoLink ?? null,
      price: updatedPrismaProject.price ?? null,
      githubLink: updatedPrismaProject.githubLink ?? null,
      env: updatedPrismaProject.env ?? null,
      password: updatedPrismaProject.password ?? null,
      createdAt: updatedPrismaProject.createdAt.toISOString(),
      updatedAt: updatedPrismaProject.updatedAt.toISOString()
    }

    return NextResponse.json(updatedProject)
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request, ctx: Context) {
  try {
    const params = await ctx.params
    const id = params.id

    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (decoded?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.project.delete({ where: { id } })
    return NextResponse.json({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}