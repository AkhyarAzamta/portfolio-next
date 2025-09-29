import { PrismaClient } from '@prisma/client'

export async function seedAbout(prisma: PrismaClient) {
  console.log('🌱 Seeding about data...')
  await prisma.about.deleteMany()

  await prisma.about.create({
    data: {
      bio: "Fresh graduate in Informatics Engineering with strong skills in Frontend and Backend Development (React, Next.js, Laravel, MySQL, Postgres). Passionate about solving coding problems and experienced in using Linux as a daily operating system. Eager to contribute to innovative projects by building efficient and scalable web applications, while continuously learning new technologies.",
    }
  })

  console.log('✅ About data seeding finished.')
}