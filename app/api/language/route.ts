// app/api/language-skills/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - Fetch all language skills
export async function GET() {
  try {
    const languageSkills = await prisma.languageSkill.findMany({
      orderBy: { level: 'desc' }
    })
    return NextResponse.json(languageSkills)
  } catch (error) {
    console.error('Error fetching language skills:', error)
    return NextResponse.json(
      { error: 'Failed to fetch language skills' },
      { status: 500 }
    )
  }
}
