// app/api/contact-info/route.ts
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
      let type: 'email' | 'phone' | 'location' = 'email'
      
      // Determine type based on key
      if (setting.key.includes('Email')) type = 'email'
      else if (setting.key.includes('Phone')) type = 'phone'
      else if (setting.key.includes('Location')) type = 'location'

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