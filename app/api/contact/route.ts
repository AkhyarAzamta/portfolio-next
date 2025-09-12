import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

interface ContactRequestBody {
  name: string;
  email: string;
  message: string;
}

export async function POST(request: Request) {
  try {
    // Add a check to ensure prisma is initialized
    if (!prisma) {
      throw new Error('Prisma client not initialized')
    }
    
    const body = await request.json() as ContactRequestBody
    
    // Validate input
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      )
    }

    // Store in database
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name: body.name,
        email: body.email,
        message: body.message
      }
    })

    return NextResponse.json(
      { 
        message: 'Message sent successfully',
        id: contactMessage.id 
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    console.error('Database error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to send message'
    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    )
  }
}