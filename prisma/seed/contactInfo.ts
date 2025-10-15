import { PrismaClient } from '@prisma/client'

export async function seedContactInfo(prisma: PrismaClient) {
  console.log('🌱 Seeding contact info...')

  const contactInfos = [
    { type: 'email', value: 'akhyar.azamta@gmail.com' },
    { type: 'phone', value: '+6285173490114' },
    { type: 'location', value: 'Bandung, West Java, Indonesia' },
  ]

  for (const info of contactInfos) {
    await prisma.contactInfo.create({ data: info })
  }

  console.log('✅ Contact info seeding finished.')
}