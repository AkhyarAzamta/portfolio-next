// app/api/auth/login/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { generateToken } from '@/lib/jwt'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Validasi input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email }
    })

    // Debug: Log user yang ditemukan
    console.log('User found:', user ? { ...user, password: 'HIDDEN' } : 'No user found')

    // Verifikasi password
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Debug: Log comparision
    console.log('Comparing password:', password, 'with hash:', user.password)
    const isPasswordValid = await bcrypt.compare(password, user.password)
    console.log('Password valid:', isPasswordValid)

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate token
    const token = await generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    })

    // Hapus password dari response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      user: userWithoutPassword,
      token
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}