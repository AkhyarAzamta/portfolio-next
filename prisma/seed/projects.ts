// prisma/seed/projects.ts
import { PrismaClient } from '@prisma/client'

export async function seedProjects(prisma: PrismaClient) {
  console.log('🌱 Seeding projects...')

  await prisma.project.deleteMany() // Clear existing data

  const projects = [
    {
      title: 'Smart FishFarm',
      description: 'An IoT-based fish farming monitoring system with real-time data visualization.',
      technologies: ['NextJS', 'ExpressJS', 'Postgresql', 'Internet of Things(IoT)', 'Socket.io', 'Chart.js'],
      sourceCode: '/projects/sourceCode.zip',
      demoLink: 'https://smart-fishfarm.vercel.app',
      image: '/projects/smartfishfarm.png',
      githubLink: 'https://github.com/AkhyarAzamta/iot-web-app',
      env: `API_KEY=your_api_key_here\nDATABASE_URL=your_database_url_here`,
      password: 'sourcecode_password123'
    },
    {
      title: 'Restaurant Web App',
      description: 'A restaurant web app with online ordering and reservation system.',
      technologies: ['Webpack', 'Javascipt', 'PWA', 'Unit Testing', 'E2E Testing'],
      sourceCode: '/projects/sourceCode.zip',
      demoLink: 'https://restaurant-apps-project.vercel.app',
      image: '/projects/restaurantapp.png',
      githubLink: 'https://github.com/AkhyarAzamta/restaurant-apps-project',
      env: `API_KEY=your_api_key_here\nDATABASE_URL=your_database_url_here`,
      password: 'sourcecode_password123'
    },
    {
      title: 'Portfolio Website',
      description: 'My personal portfolio website showcasing my projects and skills.',
      technologies: ['NextJS', 'Tailwind CSS', 'Framer Motion', 'TypeScript', 'Vercel', 'Prisma', 'PostgreSQL', 'Cloudinary'],
      sourceCode: '/projects/sourceCode.zip',
      demoLink: 'https://akhyarazamta.com',
      image: '/projects/portfolio.png',
      githubLink: 'https://github.com/AkhyarAzamta/portfolio-next',
      env: `API_KEY=your_api_key_here\nDATABASE_URL=your_database_url_here`,
      password: 'sourcecode_password123'
    },
    {
      title: 'Kasir App',
      description: 'A point-of-sale (POS) application for small businesses.',
      technologies: ['ReactJS', 'Tailwind CSS', ],
      sourceCode: '/projects/sourceCode.zip',
      demoLink: '#',
      image: '/projects/kasirapp.png',
      githubLink: 'https://github.com/AkhyarAzamta/Kasir-App-ReactJS-',
      env: `API_KEY=your_api_key_here\nDATABASE_URL=your_database_url_here`,
      password: 'sourcecode_password123'
    },
    {
      title: 'Notes App Flutter',
      description: 'A cross-platform mobile app for taking and managing notes.',
      technologies: ['Flutter', 'Dart', 'ExpressJS', 'MySQL'],
      sourceCode: '/projects/sourceCode.zip',
      demoLink: '#',
      image: '/projects/notesapp.png',
      githubLink: 'https://github.com/AkhyarAzamta/Notes-App-Flutter',
      env: `API_KEY=your_api_key_here\nDATABASE_URL=your_database_url_here`,
      password: 'sourcecode_password123'
    },
    // {
    //   title: 'Chat Application',
    //   description: 'A real-time chat application using WebSocket technology.',
    //   technologies: ['React', 'Node.js', 'Socket.io'],
    //   sourceCode: '/projects/sourceCode.zip',
    //   demoLink: 'https://demo.com',
    //   image: '/projects/chat-app.png',
    //   githubLink: 'https://github.com/yourusername/ecommerce',
    //   env: `API_KEY=your_api_key_here\nDATABASE_URL=your_database_url_here`,
    //   password: 'sourcecode_password123'
    // },
    // {
    //   title: 'Recipe Finder',
    //   description: 'A recipe search application using the Edamam API.',
    //   technologies: ['React', 'Edamam API'],
    //   sourceCode: '/projects/sourceCode.zip',
    //   demoLink: 'https://demo.com',
    //   image: '/projects/recipe-finder.png',
    //   githubLink: 'https://github.com/yourusername/ecommerce',
    //   env: `API_KEY=your_api_key_here\nDATABASE_URL=your_database_url_here`,
    //   password: 'sourcecode_password123'
    // },
    // {
    //   title: 'Expense Tracker',
    //   description: 'A personal finance tracker to manage expenses and income.',
    //   technologies: ['React', 'Firebase'],
    //   sourceCode: '/projects/sourceCode.zip',
    //   demoLink: 'https://demo.com',
    //   image: '/projects/expense-tracker.webp',
    //   githubLink: 'https://github.com/yourusername/ecommerce',
    //   env: `API_KEY=your_api_key_here\nDATABASE_URL=your_database_url_here`,
    //   password: 'sourcecode_password123'
    // }
  ]

  for (const project of projects) {
    await prisma.project.create({ data: project })
  }

  console.log('✅ Projects seeding finished.')
}
