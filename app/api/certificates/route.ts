// app/api/certificates/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - Fetch all certificates
export async function GET() {
  try {
    const certificates = await prisma.certificate.findMany({
      orderBy: { issueDate: 'desc' }
    })

    // Convert Date objects to ISO strings for proper serialization
    const serializedCertificates = certificates.map(certificate => ({
      ...certificate,
      issueDate: certificate.issueDate.toISOString(),
      expiryDate: certificate.expiryDate ? certificate.expiryDate.toISOString() : null
    }))

    return NextResponse.json(serializedCertificates)
  } catch (error) {
    console.error('Error fetching certificates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch certificates' },
      { status: 500 }
    )
  }
}