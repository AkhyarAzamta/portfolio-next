// app/api/admin/settings/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { withAdminAuth } from '@/lib/withAdminAuth'
import { Setting, SettingCategory, SettingType } from '@/types'

/**
 * GET /api/admin/settings
 * Ambil semua site settings
 */
export const GET = withAdminAuth(async () => {
  try {
    const siteSetting = await prisma.siteSetting.findMany({
      orderBy: { order: 'asc' }
    })

    // Format settings untuk frontend
    const settings = siteSetting.reduce<Record<string, Setting>>((acc, setting) => {
      acc[setting.key] = {
        id: setting.id,
        key: setting.key,
        value: setting.type === 'number' ? Number(setting.value) : 
               setting.type === 'boolean' ? setting.value === 'true' : 
               setting.value,
        type: setting.type as SettingType,
        category: setting.category as SettingCategory,
        label: setting.label,
        description: setting.description || undefined,
        options: setting.options ? JSON.parse(setting.options) : [],
        order: setting.order,
        createdAt: setting.createdAt.toISOString(),
        updatedAt: setting.updatedAt.toISOString(),
      }
      return acc
    }, {})

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' }, 
      { status: 500 }
    )
  }
})

/**
 * POST /api/admin/settings
 * Update banyak setting sekaligus
 */
export const POST = withAdminAuth(async (request: Request) => {
  try {
    const updates = await request.json()

    if (!updates || typeof updates !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body' }, 
        { status: 400 }
      )
    }

    // Update each setting
    for (const [key, value] of Object.entries(updates)) {
      await prisma.siteSetting.updateMany({
        where: { key },
        data: { 
          value: String(value),
          updatedAt: new Date()
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' }, 
      { status: 500 }
    )
  }
})

/**
 * PUT /api/admin/settings
 * Buat setting baru
 */
export const PUT = withAdminAuth(async (request: Request) => {
  try {
    const body = await request.json()

    // Validasi required fields
    if (!body.key || !body.label || !body.type || !body.category) {
      return NextResponse.json(
        { error: 'Key, label, type, and category are required' },
        { status: 400 }
      )
    }

    // Check if key already exists
    const existingSetting = await prisma.siteSetting.findUnique({
      where: { key: body.key }
    })

    if (existingSetting) {
      return NextResponse.json(
        { error: 'Setting with this key already exists' },
        { status: 409 }
      )
    }

    // Create new setting
    const newSetting = await prisma.siteSetting.create({
      data: {
        key: body.key,
        value: String(body.value || ''),
        type: body.type,
        category: body.category,
        label: body.label,
        description: body.description || '',
        options: body.options ? JSON.stringify(body.options) : null,
        order: body.order || 0,
      }
    })

    return NextResponse.json(newSetting)
  } catch (error) {
    console.error('Error creating setting:', error)
    return NextResponse.json(
      { error: 'Failed to create setting' },
      { status: 500 }
    )
  }
})