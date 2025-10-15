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
import { seedSettings } from './settings.ts'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Start seeding...')

  // HAPUS SEMUA DATA DULU (dalam urutan yang benar)
  console.log('🗑️  Deleting existing data...')
  await prisma.contactInfo.deleteMany()
  await prisma.certificate.deleteMany()
  await prisma.education.deleteMany()
  await prisma.experience.deleteMany()
  await prisma.skill.deleteMany()
  await prisma.skillCategory.deleteMany()
  await prisma.about.deleteMany()
  await prisma.blog.deleteMany()      // Child table dulu
  await prisma.project.deleteMany()   // Child table dulu
  await prisma.siteSetting.deleteMany()
  await prisma.user.deleteMany()      // Parent table terakhir
  console.log('✅ All existing data deleted')

  // SEED DATA (dalam urutan yang benar)
  await seedUsers(prisma)             // Parent table dulu
  await seedSettings(prisma)
  await seedAbout(prisma)
  await seedSkills(prisma)
  await seedExperience(prisma)
  await seedEducation(prisma)
  await seedCertificate(prisma)
  await seedContactInfo(prisma)
  await seedProjects(prisma)          // Butuh user sebagai author
  await seedBlogs(prisma)             // Butuh user sebagai author

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