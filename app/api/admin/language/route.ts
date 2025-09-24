// app/api/language-skills/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// POST - Create a new language skill
export async function POST(request: NextRequest) {
  try {
    const { name, level, category, logo } = await request.json()
    
    const languageSkill = await prisma.languageSkill.create({
      data: {
        name,
        level,
        category,
        logo
      }
    })
    
    return NextResponse.json(languageSkill)
  } catch (error) {
    console.error('Error creating language skill:', error)
    return NextResponse.json(
      { error: 'Failed to create language skill' },
      { status: 500 }
    )
  }
}