// scripts/seed-about.ts
import prisma from '@/lib/prisma'

export async function seedAbout() {
  console.log('🌱 Seeding about data...')

  // Hapus data existing (opsional)
  await prisma.about.deleteMany()
  await prisma.skill.deleteMany()
  await prisma.skillCategory.deleteMany()
  await prisma.experience.deleteMany()
  await prisma.education.deleteMany()
  await prisma.languageSkill.deleteMany() 

  // Tambah data about
  await prisma.about.create({
    data: {
      bio: "I'm a passionate Full Stack Developer with expertise in building modern web applications. With a strong foundation in both frontend and backend technologies, I create seamless user experiences and robust server-side solutions."
    }
  })

  console.log('✅ About data seeding finished.')
}

export async function seedSkills() {
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
  ]

  const backendSkills = [
    { name: "Node.js", logo: "/logos/nodejs.png", categoryId: backendCategory.id },
    { name: "Laravel", logo: "/logos/laravel.png", categoryId: backendCategory.id },
    { name: "Express", logo: "/logos/express.png", categoryId: backendCategory.id },
    { name: "PostgreSQL", logo: "/logos/postgresql.png", categoryId: backendCategory.id },
    { name: "MySQL", logo: "/logos/mysql.png", categoryId: backendCategory.id },
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
    { name: "WebSocket", logo: "/logos/websocket.png", categoryId: toolsCategory.id },
  ]

  await prisma.skill.createMany({
    data: [...frontendSkills, ...backendSkills, ...languagesSkills, ...toolsSkills]
  })

  console.log('✅ Skills seeding finished.')
}

export async function seedExperience() {
  console.log('🌱 Seeding experience...')

  // Tambah pengalaman
  await prisma.experience.createMany({
    data: [
      {
        title: "Senior Full Stack Developer",
        company: "Company Name",
        period: "2020 - Present",
        description: [
          "Led development of multiple web applications using React and Node.js",
          "Implemented CI/CD pipelines reducing deployment time by 50%",
          "Mentored junior developers and conducted code reviews"
        ]
      },
      {
        title: "Full Stack Developer",
        company: "Previous Company",
        period: "2018 - 2020",
        description: [
          "Developed and maintained RESTful APIs",
          "Built responsive user interfaces with modern JavaScript frameworks",
          "Optimized database queries improving performance by 40%"
        ]
      }
    ]
  })

  console.log('✅ Experience seeding finished.')
}

export async function seedEducation() {
  console.log('🌱 Seeding education...')

  // Tambah pendidikan
  await prisma.education.create({
    data: {
      degree: "Bachelor of Science in Computer Science",
      institution: "University Name",
      period: "2014 - 2018",
      description: "Graduated with honors. Focused on software engineering and web development."
    }
  })

  console.log('✅ Education seeding finished.')
}

// Update the main seed function to include language skills
export async function seedAll() {
  await seedAbout()
  await seedSkills()
  await seedExperience()
  await seedEducation()
  console.log('✅ All seeding finished!')
}