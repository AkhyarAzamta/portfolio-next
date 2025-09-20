// app/api/admin/skills/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// PUT - Update a skill
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, logo, categoryId } = await request.json()
    
    const skill = await prisma.skill.update({
      where: { id: parseInt(id) },
      data: {
        name,
        logo,
        categoryId
      }
    })
    
    return NextResponse.json(skill)
  } catch (error) {
    console.error('Error updating skill:', error)
    return NextResponse.json(
      { error: 'Failed to update skill' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a skill
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.skill.delete({
      where: { id: parseInt(id) }
    })
    
    return NextResponse.json({ message: 'Skill deleted successfully' })
  } catch (error) {
    console.error('Error deleting skill:', error)
    return NextResponse.json(
      { error: 'Failed to delete skill' },
      { status: 500 }
    )
  }
}