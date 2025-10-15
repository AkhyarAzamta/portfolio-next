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
      },
      {
        name: "React Fundamentals",
        issuer: "Dicoding",
        issueDate: new Date("2024-09-22"),
        expiryDate: new Date("2027-09-22"),
        credentialURL: "https://www.dicoding.com/certificates/GRX54N0KRP0M",
        image: "/certificates/react.jpg"
      },
      {
        name: "Software Developer",
        issuer: "Dicoding",
        issueDate: new Date("2023-11-24"),
        expiryDate: new Date("2026-11-24"),
        credentialURL: "https://www.dicoding.com/certificates/JMZVDQMMJZN9",
        image: "/certificates/softdevbasic.jpg"
      },
      {
        name: "Version Control with Git and GitHub",
        issuer: "Dicoding",
        issueDate: new Date("2023-08-29"),
        expiryDate: new Date("2026-08-29"),
        credentialURL: "https://www.dicoding.com/certificates/1OP80G3J8XQK",
        image: "/certificates/github.jpg"
      },
      {
        name: "Architecting on AWS",
        issuer: "Dicoding",
        issueDate: new Date("2023-08-25"),
        expiryDate: new Date("2026-08-25"),
        credentialURL: "https://www.dicoding.com/certificates/1RXY65G39ZVM",
        image: "/certificates/aws.jpg"
      },
      {
        name: "Network Fundamentals",
        issuer: "Dicoding",
        issueDate: new Date("2023-08-25"),
        expiryDate: new Date("2026-08-25"),
        credentialURL: "https://www.dicoding.com/certificates/1OP8E3J8XQK0",
        image: "/certificates/networking.jpg"
      }
    ]
  })

  console.log('✅ Certificates seeding finished.')
}