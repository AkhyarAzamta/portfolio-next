import { PrismaClient } from '@prisma/client'

export async function seedCertificate(prisma: PrismaClient) {
  console.log('🌱 Seeding certificates...')
  await prisma.certificate.deleteMany()

  await prisma.certificate.createMany({
    data: [
      {
        name: "Front-End Web Developer",
        issuer: "Dicoding",
        issueDate: new Date("2023-12-20"),
        expiryDate: new Date("2026-12-20"),
        credentialURL: "https://www.dicoding.com/certificates/1RXY1OKN1PVM",
        image: "/certificates/FE.jpg"
      },
      {
        name: "Back-End Web Developer",
        issuer: "Dicoding",
        issueDate: new Date("2023-11-01"),
        expiryDate: new Date("2026-11-01"),
        credentialURL: "https://www.dicoding.com/certificates/KEXLLW13MXG2",
        image: "/certificates/BE.jpg"
      }
    ]
  })

  console.log('✅ Certificates seeding finished.')
}