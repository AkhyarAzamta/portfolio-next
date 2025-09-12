import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const experience = await prisma.experience.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json(experience)
  } catch (error) {
    console.error('Error fetching experience:', error)
    return NextResponse.json(
      { error: 'Failed to fetch experience' },
      { status: 500 }
    )
  }
}