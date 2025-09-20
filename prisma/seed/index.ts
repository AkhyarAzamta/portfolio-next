// scripts/seed.ts
import { PrismaClient } from '@prisma/client'
import { seedProjects } from './projects'
import { seedBlogs } from './blogs'
import { seedAbout, seedSkills, seedExperience, seedEducation } from './about'
import { seedContactInfo } from './contact-info'
import { seedUsers } from './users'

import prisma from '@/lib/prisma'

async function main() {
  console.log('🌱 Start seeding...')

  await seedUsers()
  await seedBlogs()
  await seedProjects()
  await seedAbout()
  await seedSkills()
  await seedExperience()
  await seedEducation()
  await seedContactInfo()

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