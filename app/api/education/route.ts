import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const education = await prisma.education.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json(education)
  } catch (error) {
    console.error('Error fetching education:', error)
    return NextResponse.json(
      { error: 'Failed to fetch education' },
      { status: 500 }
    )
  }
}