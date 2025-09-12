// app/api/admin/projects/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/lib/jwt'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    // Verify authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (decoded?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get all projects
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    // Verify authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (decoded?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Create new project
    const body = await request.json()
    const { title, description, technologies, githubLink, demoLink, image, freeToUse, featured } = body

    const project = await prisma.project.create({
      data: {
        title,
        description,
        technologies,
        githubLink,
        demoLink,
        image,
        freeToUse: freeToUse || false,
        featured: featured || false
      }
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}