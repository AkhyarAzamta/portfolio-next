import { PrismaClient } from '@prisma/client'

export async function seedExperience(prisma: PrismaClient) {
  console.log('🌱 Seeding experience...')
  await prisma.experience.deleteMany()

  await prisma.experience.createMany({
    data: [
      {
        title: "IoT Programmer",
        company: "Toel Jam Sholat Digital",
        period: "Jul 2019 - Aug 2021",
        description: [
          "Developed IoT solutions for smart prayer time devices",
          "Implemented firmware updates and maintenance for devices",
          "Provided technical support and troubleshooting for clients"
        ]
      },
      {
        title: "Full Stack Web Developer Internship",
        company: "PT. Presentologics (Dicoding)",
        period: "Aug 2023 - Jan 2024",
        description: [
          "The program covers back-end fundamentals with Node.js, RESTful API development and deployment, as well as front-end practices including mobile-first design, accessibility, and responsive web development.",
          "Learning clean JavaScript coding, Progressive Web Apps, automated testing, performance optimization, and deployment with CI/CD pipelines.",
          "Evaluation consists of practical projects such as building a Bookshelf API with CRUD functionality and a mobile-friendly restaurant catalog web app."
        ]
      }
    ]
  })

  console.log('✅ Experience seeding finished.')
}