// app/api/language-skills/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// PUT - Update a language skill
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, level, category, logo } = await request.json()
    
    const languageSkill = await prisma.languageSkill.update({
      where: { id: parseInt(id) },
      data: {
        name,
        level,
        category,
        logo
      }
    })
    
    return NextResponse.json(languageSkill)
  } catch (error) {
    console.error('Error updating language skill:', error)
    return NextResponse.json(
      { error: 'Failed to update language skill' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a language skill
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.languageSkill.delete({
      where: { id: parseInt(id) }
    })
    
    return NextResponse.json({ message: 'Language skill deleted successfully' })
  } catch (error) {
    console.error('Error deleting language skill:', error)
    return NextResponse.json(
      { error: 'Failed to delete language skill' },
      { status: 500 }
    )
  }
}