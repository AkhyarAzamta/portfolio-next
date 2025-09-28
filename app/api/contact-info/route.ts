import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    // Ambil contact info dari site settings dengan category 'contact'
    const contactSettings = await prisma.siteSetting.findMany({
      where: {
        category: 'contact'
      },
      orderBy: {
        order: 'asc'
      }
    })

    // Format data untuk frontend
    const contactInfos = contactSettings.map(setting => {
      const key = setting.key.toLowerCase() // biar gak masalah kapital

      let type: 'email' | 'phone' | 'location' = 'email'

      if (key.includes('email')) type = 'email'
      else if (key.includes('phone')) type = 'phone'
      else if (key.includes('location') || key.includes('address')) type = 'location'

      return {
        id: setting.id,
        type,
        value: setting.value
      }
    })
    return NextResponse.json(contactInfos)
  } catch (error) {
    console.error('Error fetching contact info:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
