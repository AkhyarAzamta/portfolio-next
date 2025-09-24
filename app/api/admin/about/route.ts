// app/api/admin/about/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - Fetch about data
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

// PUT - Update about data
export async function PUT(request: NextRequest) {
  try {
    const { bio } = await request.json()
    
    // Check if about data exists
    const existingAbout = await prisma.about.findFirst()
    
    let about
    if (existingAbout) {
      about = await prisma.about.update({
        where: { id: existingAbout.id },
        data: { bio }
      })
    } else {
      about = await prisma.about.create({
        data: { bio }
      })
    }
    
    return NextResponse.json(about)
  } catch (error) {
    console.error('Error updating about:', error)
    return NextResponse.json(
      { error: 'Failed to update about data' },
      { status: 500 }
    )
  }
}