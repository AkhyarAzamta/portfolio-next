// scripts/seed-contact-info.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function seedContactInfo() {
  console.log('🌱 Seeding contact info...')

  // Hapus data existing (opsional)
  await prisma.contactInfo.deleteMany()

  const contactInfos = [
    { type: 'email', value: 'akhyar.azamta@gmail.com' },
    { type: 'phone', value: '+6285173490114' },
    { type: 'location', value: 'Bandung, West Java, Indonesia' },
  ]

  for (const info of contactInfos) {
    await prisma.contactInfo.create({
      data: info,
    })
  }

  console.log('✅ Contact info seeding finished.')
}