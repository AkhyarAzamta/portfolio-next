// app/api/admin/skills/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - Fetch all skill categories with their skills
export async function GET() {
  try {
    const skillCategories = await prisma.skillCategory.findMany({
      include: {
        skills: true
      }
    })
    return NextResponse.json(skillCategories)
  } catch (error) {
    console.error('Error fetching skills:', error)
    return NextResponse.json(
      { error: 'Failed to fetch skills' },
      { status: 500 }
    )
  }
}

// POST - Create a new skill
export async function POST(request: NextRequest) {
  try {
    const { name, logo, categoryId } = await request.json()
    
    const skill = await prisma.skill.create({
      data: {
        name,
        logo,
        categoryId
      }
    })
    
    return NextResponse.json(skill)
  } catch (error) {
    console.error('Error creating skill:', error)
    return NextResponse.json(
      { error: 'Failed to create skill' },
      { status: 500 }
    )
  }
}