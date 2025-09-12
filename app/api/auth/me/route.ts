// app/api/auth/me/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/jwt'

export async function GET() {
  try {
    const cookieStore = cookies()
    const token = (await cookieStore).get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Token not provided or invalid' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Token not provided or invalid' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true, name: true, email: true, role: true, avatar: true, title: true, bio: true,
        githubUrl: true, linkedinUrl: true, instagramUrl: true, createdAt: true, updatedAt: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Auth me error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
