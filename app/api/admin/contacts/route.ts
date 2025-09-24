// app/api/admin/contact/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { ContactRequestBody } from '@/types'

export async function GET() {
  try {
    const contacts = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(contacts)
  } catch (error) {
    console.error('Error fetching contact messages:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    if (!prisma) {
      throw new Error('Prisma client not initialized')
    }
    
    const body = await request.json() as ContactRequestBody
    
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      )
    }

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