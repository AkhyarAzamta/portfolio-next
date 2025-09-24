// app/api/experience/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - Fetch all experiences
export async function GET() {
  try {
    const experiences = await prisma.experience.findMany()
    return NextResponse.json(experiences)
  } catch (error) {
    console.error('Error fetching experiences:', error)
    return NextResponse.json(
      { error: 'Failed to fetch experiences' },
      { status: 500 }
    )
  }
}

// POST - Create a new experience
export async function POST(request: NextRequest) {
  try {
    const { title, company, period, description } = await request.json()
    
    const experience = await prisma.experience.create({
      data: {
        title,
        company,
        period,
        description
      }
    })
    
    return NextResponse.json(experience)
  } catch (error) {
    console.error('Error creating experience:', error)
    return NextResponse.json(
      { error: 'Failed to create experience' },
      { status: 500 }
    )
  }
}