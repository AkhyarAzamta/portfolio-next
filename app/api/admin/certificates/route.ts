// app/api/certificates/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// POST - Create a new certificate
export async function POST(request: NextRequest) {
  try {
    const { name, issuer, issueDate, expiryDate, credentialURL, image } = await request.json()
    
    const certificate = await prisma.certificate.create({
      data: {
        name,
        issuer,
        issueDate,
        expiryDate,
        credentialURL,
        image
      }
    })
    
    return NextResponse.json(certificate)
  } catch (error) {
    console.error('Error creating certificate:', error)
    return NextResponse.json(
      { error: 'Failed to create certificate' },
      { status: 500 }
    )
  }
}