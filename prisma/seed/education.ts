import { PrismaClient } from '@prisma/client'

export async function seedEducation(prisma: PrismaClient) {
  console.log('🌱 Seeding education...')
  await prisma.education.deleteMany()

  const education = [
    {
      degree: "Bachelor of Engineering in Informatics",
      institution: "Universitas Islam Nusantara",
      period: "2021 - 2025",
      description: "Graduated with honors. Focused on software engineering and web development."
    },
    {
      degree: "Diploma in Electronics Engineering (Vocational High School)",
      institution: "SMK Negeri 7 Baleendah",
      period: "2016 - 2019",
      description: "Specialized in electronics engineering with emphasis on hardware and embedded systems."
    }
  ]

  for (const edu of education) {
    await prisma.education.create({ data: edu })
  }

  console.log('✅ Education seeding finished.')
}