// app/api/admin/settings/seed/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { withAdminAuth } from '@/lib/withAdminAuth'
import { defaultSettingsSeed } from '@/data/seedSettings'

/**
 * POST /api/admin/settings/seed
 * Reset semua settings ke default
 */
export const POST = withAdminAuth(async () => {
  try {
    // Hapus semua settings yang ada
    await prisma.siteSetting.deleteMany({})

    // Insert default settings
    for (const setting of defaultSettingsSeed) {
      await prisma.siteSetting.create({
        data: {
          key: setting.key,
          value: setting.value,
          type: setting.type,
          category: setting.category,
          label: setting.label,
          description: setting.description || '',
          options: setting.options ? JSON.stringify(setting.options) : null,
          order: setting.order,
        }
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Settings reset to default successfully',
      count: defaultSettingsSeed.length
    })
  } catch (error) {
    console.error('Error resetting settings:', error)
    return NextResponse.json(
      { error: 'Failed to reset settings' }, 
      { status: 500 }
    )
  }
})