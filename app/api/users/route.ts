// app/api/users/route.ts
import { NextResponse } from 'next/server'

import prisma from '@/lib/prisma'

export const revalidate = 60

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        title: true,
        bio: true,
        githubUrl: true,
        linkedinUrl: true,
        instagramUrl: true,
        createdAt: true,
        updatedAt: true
      }
    })
    
    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}