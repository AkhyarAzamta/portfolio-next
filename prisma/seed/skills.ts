import { PrismaClient } from '@prisma/client'

export async function seedSkills(prisma: PrismaClient) {
  console.log('🌱 Seeding skills...')
  
  // Tambah kategori skill
  const frontendCategory = await prisma.skillCategory.create({
    data: { name: "Frontend", icon: "FaCode", description: "Frontend development technologies" }
  })

  const backendCategory = await prisma.skillCategory.create({
    data: { name: "Backend", icon: "FaLaptopCode", description: "Backend development technologies" }
  })

  const languagesCategory = await prisma.skillCategory.create({
    data: { name: "Programming Languages", icon: "FaLanguage", description: "Programming languages I use" }
  })

  const toolsCategory = await prisma.skillCategory.create({
    data: { name: "Tools & Others", icon: "FaTools", description: "Development tools and other technologies" }
  })

  // Tambah skills untuk setiap kategori
  const frontendSkills = [
    { name: "React / Next.js", logo: "/logos/react.png", categoryId: frontendCategory.id },
    { name: "Webpack", logo: "/logos/webpack.png", categoryId: frontendCategory.id },
    { name: "Tailwind CSS", logo: "/logos/tailwind.png", categoryId: frontendCategory.id },
    { name: "HTML5", logo: "/logos/html.png", categoryId: frontendCategory.id },
    { name: "Progressive Web Apps (PWA)", logo: "/logos/pwa.png", categoryId: frontendCategory.id },
  ]

  const backendSkills = [
    { name: "Node.js", logo: "/logos/nodejs.png", categoryId: backendCategory.id },
    { name: "Laravel", logo: "/logos/laravel.png", categoryId: backendCategory.id },
    { name: "Express", logo: "/logos/express.png", categoryId: backendCategory.id },
    { name: "PostgreSQL", logo: "/logos/postgresql.png", categoryId: backendCategory.id },
    { name: "MySQL", logo: "/logos/mysql.png", categoryId: backendCategory.id },
    { name: "RESTful API", logo: "/logos/restapi.png", categoryId: backendCategory.id },
    { name: "WebSocket", logo: "/logos/websocket.png", categoryId: backendCategory.id },
    { name: "Amazon EC2 (Deployment)", logo: "/logos/aws.png", categoryId: backendCategory.id },
  ]
  
  const languagesSkills = [
    { name: "JavaScript", logo: "/logos/javascript.png", categoryId: languagesCategory.id },
    { name: "TypeScript", logo: "/logos/typescript.png", categoryId: languagesCategory.id },
    { name: "C++", logo: "/logos/cpp.png", categoryId: languagesCategory.id },
    { name: "PHP", logo: "/logos/php.png", categoryId: languagesCategory.id },
  ]
  
  const toolsSkills = [
    { name: "Git / GitHub", logo: "/logos/github.png", categoryId: toolsCategory.id },
    { name: "Internet of Things (IoT)", logo: "/logos/iot.png", categoryId: toolsCategory.id },
    { name: "MQTT", logo: "/logos/mqtt.png", categoryId: toolsCategory.id },
    { name: "Postman", logo: "/logos/postman.png", categoryId: toolsCategory.id },
    { name: "Automation Testing (Unit, Integration, E2E)", logo: "/logos/testing.png", categoryId: toolsCategory.id },
    { name: "JavaScript Clean Code", logo: "/logos/cleancode.png", categoryId: toolsCategory.id },
    { name: "CI/CD (Continuous Integration & Deployment)", logo: "/logos/cicd.png", categoryId: toolsCategory.id },
  ]

  await prisma.skill.createMany({
    data: [...frontendSkills, ...backendSkills, ...languagesSkills, ...toolsSkills]
  })

  console.log('✅ Skills seeding finished.')
}
