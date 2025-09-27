// app/api/admin/settings/[id]/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { withAdminAuthParams } from '@/lib/withAdminAuth'

/**
 * PATCH /api/admin/settings/[id] - Update individual setting
 */
export const PATCH = withAdminAuthParams<{ id: string }>(async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params
    const body = await request.json()

    const updatedSetting = await prisma.siteSettings.update({
      where: { id },
      data: {
        ...(body.key && { key: body.key }),
        ...(body.value !== undefined && { value: String(body.value) }),
        ...(body.type && { type: body.type }),
        ...(body.category && { category: body.category }),
        ...(body.label && { label: body.label }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.options !== undefined && { 
          options: body.options ? JSON.stringify(body.options) : null 
        }),
        ...(body.order !== undefined && { order: body.order }),
        updatedAt: new Date(),
      }
    })

    return NextResponse.json(updatedSetting)
  } catch (error) {
    console.error('Error updating setting:', error)
    return NextResponse.json(
      { error: 'Failed to update setting' },
      { status: 500 }
    )
  }
})

/**
 * DELETE /api/admin/settings/[id] - Hapus setting
 */
export const DELETE = withAdminAuthParams<{ id: string }>(async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params

    await prisma.siteSettings.delete({
      where: { id }
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Setting deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting setting:', error)
    return NextResponse.json(
      { error: 'Failed to delete setting' },
      { status: 500 }
    )
  }
})