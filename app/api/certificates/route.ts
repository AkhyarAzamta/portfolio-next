// app/api/certificates/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - Fetch all certificates
export async function GET() {
  try {
    const certificates = await prisma.certificate.findMany({
      orderBy: { issueDate: 'desc' }
    })
    return NextResponse.json(certificates)
  } catch (error) {
    console.error('Error fetching certificates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch certificates' },
      { status: 500 }
    )
  }
}