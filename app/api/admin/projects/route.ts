// app/api/admin/projects/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/jwt'
import type { Project as ProjectType } from '@/types'

export async function GET(request: Request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const decoded = await verifyToken(token)
    if (decoded?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const prismaProjects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } })

    const projects: ProjectType[] = prismaProjects.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      technologies: p.technologies ?? [],
      sourceCode: p.sourceCode ?? null,
      demoLink: p.demoLink ?? null,
      image: p.image,
      archived: p.archived,
      price: p.price ?? null,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString()
    }))

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const decoded = await verifyToken(token)
    if (decoded?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Parse body safely (unknown -> Record)
    const raw = (await request.json()) as unknown
    const body = (raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {})

    // Validate required fields and coerce types
    const title = typeof body.title === 'string' ? body.title.trim() : ''
    const description = typeof body.description === 'string' ? body.description.trim() : ''

    // technologies can be array or CSV string
    const techRaw = body.technologies
    let technologies: string[] = []

    if (Array.isArray(techRaw)) {
      // convert everything to string and trim
      technologies = techRaw.map((item) => String(item).trim()).filter(Boolean)
    } else if (typeof techRaw === 'string') {
      // explicit typing for s to avoid implicit any
      technologies = techRaw.split(',').map((s: string) => s.trim()).filter(Boolean)
    }

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 })
    }

    const image = typeof body.image === 'string' ? body.image : ''
    const sourceCode = typeof body.sourceCode === 'string' ? body.sourceCode : null
    const demoLink = typeof body.demoLink === 'string' ? body.demoLink : null

    // price might be number or numeric string
    let price: number | null = null
    if (typeof body.price === 'number') price = body.price
    else if (typeof body.price === 'string' && body.price.trim() !== '') {
      const parsed = Number(body.price)
      price = Number.isFinite(parsed) ? parsed : null
    }

    const archived = Boolean(body.archived ?? false)

    // Create project in DB
    const created = await prisma.project.create({
      data: {
        title,
        description,
        technologies,
        sourceCode,
        demoLink,
        image,
        price,
        archived
      }
    })

    const project: ProjectType = {
      id: created.id,
      title: created.title,
      description: created.description,
      technologies: created.technologies ?? [],
      sourceCode: created.sourceCode ?? null,
      demoLink: created.demoLink ?? null,
      image: created.image,
      archived: created.archived,
      price: created.price ?? null,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString()
    }

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
