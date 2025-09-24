import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const about = await prisma.about.findFirst()
    
    return NextResponse.json(about)
  } catch (error) {
    console.error('Error fetching about:', error)
    return NextResponse.json(
      { error: 'Failed to fetch about data' },
      { status: 500 }
    )
  }
}