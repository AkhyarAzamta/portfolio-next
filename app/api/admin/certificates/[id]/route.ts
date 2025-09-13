// app/api/certificates/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// PUT - Update a certificate
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name, issuer, issueDate, expiryDate, credentialURL, image } = await request.json()
    
    const certificate = await prisma.certificate.update({
      where: { id: parseInt(params.id) },
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
    console.error('Error updating certificate:', error)
    return NextResponse.json(
      { error: 'Failed to update certificate' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a certificate
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.certificate.delete({
      where: { id: parseInt(params.id) }
    })
    
    return NextResponse.json({ message: 'Certificate deleted successfully' })
  } catch (error) {
    console.error('Error deleting certificate:', error)
    return NextResponse.json(
      { error: 'Failed to delete certificate' },
      { status: 500 }
    )
  }
}