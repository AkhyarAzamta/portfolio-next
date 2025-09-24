import { PrismaClient } from '@prisma/client'
import { seedUsers } from './users.ts'
import { seedProjects } from './projects.ts'
import { seedBlogs } from './blogs.ts'
import { seedAbout } from './about.ts'
import { seedSkills } from './skills.ts'
import { seedExperience } from './experience.ts'
import { seedEducation } from './education.ts'
import { seedCertificate } from './certificate.ts'
import { seedContactInfo } from './contactInfo.ts'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Start seeding...')

  await seedUsers(prisma)
  await seedProjects(prisma)
  await seedBlogs(prisma)
  await seedAbout(prisma)
  await seedSkills(prisma)
  await seedExperience(prisma)
  await seedEducation(prisma)
  await seedCertificate(prisma)
  await seedContactInfo(prisma)

  console.log('✅ Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })