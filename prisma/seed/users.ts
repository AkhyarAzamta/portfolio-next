import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'

export async function seedUsers(prisma: PrismaClient) {
  console.log('🌱 Seeding users...')

  const hashedPassword = await bcrypt.hash('password123', 12)

  const users = [
    {
      name: 'Akhyar Azamta',
      email: 'akhyar.azamta@gmail.com',
      password: hashedPassword,
      role: UserRole.ADMIN,
      avatar: '/profile.jpg',
      title: 'Frontend Developer | Backend Developer | IoT Engineer',
      bio: 'Passionate developer with expertise in building modern web applications',
      githubUrl: 'https://github.com/akhyarazamta',
      linkedinUrl: 'https://linkedin.com/in/akhyarazamta',
      instagramUrl: 'https://instagram.com/akhyarazamta'
    },
    {
      name: 'Regular User',
      email: 'user@example.com',
      password: hashedPassword,
      role: UserRole.USER,
      avatar: '/avatars/user.jpg',
      title: 'Junior Developer',
      bio: 'Passionate about learning new technologies'
    }
  ]

  for (const user of users) {
    await prisma.user.create({ data: user })
  }

  console.log('✅ Users seeding finished.')
}