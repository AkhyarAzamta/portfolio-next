import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function seedProjects() {
  console.log('🌱 Seeding projects...')

  await prisma.project.deleteMany() // Clear existing data

  const projects: {
    title: string
    description: string
    technologies: string[]
    sourceCode?: string
    demoLink?: string
    image: string
    githubLink?: string
    env?: string
    password?: string
  }[] = [
    {
      title: 'E-commerce Platform',
      description: 'A full-stack e-commerce platform built with Next.js, TypeScript, and Tailwind CSS.',
      technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Stripe'],
      sourceCode: '/projects/sourceCode.zip',
      demoLink: 'https://demo.com',
      image: '/projects/e-commerce-website.png',
      githubLink: 'https://github.com/yourusername/ecommerce',
      env: `API_KEY=your_api_key_here\nDATABASE_URL=your_database_url_here`,
      password: 'sourcecode_password123'
    },
    {
      title: 'Task Management App',
      description: 'A collaborative task management application with real-time updates.',
      technologies: ['React', 'Node.js', 'MongoDB', 'Socket.io'],
      sourceCode: '/projects/sourceCode.zip',
      demoLink: 'https://demo.com',
      image: '/projects/task-manager.webp',
      githubLink: 'https://github.com/yourusername/ecommerce',
      env: `API_KEY=your_api_key_here\nDATABASE_URL=your_database_url_here`,
      password: 'sourcecode_password123'
    },
    {
      title: 'Portfolio Website',
      description: 'My personal portfolio website showcasing my projects and skills.',
      technologies: ['Next.js', 'Tailwind CSS', 'Framer Motion'],
      sourceCode: '/projects/sourceCode.zip',
      demoLink: 'https://demo.com',
      image: '/projects/portfolio-website.jpg',
      githubLink: 'https://github.com/yourusername/ecommerce',
      env: `API_KEY=your_api_key_here\nDATABASE_URL=your_database_url_here`,
      password: 'sourcecode_password123'
    },
    {
      title: 'Blog Platform',
      description: 'A blogging platform with user authentication and markdown support.',
      technologies: ['Gatsby', 'GraphQL', 'Contentful'],
      sourceCode: '/projects/sourceCode.zip',
      demoLink: 'https://demo.com',
      image: '/projects/blog-website.jpeg',
      githubLink: 'https://github.com/yourusername/ecommerce',
      env: `API_KEY=your_api_key_here\nDATABASE_URL=your_database_url_here`,
      password: 'sourcecode_password123'
    },
    {
      title: 'Weather App',
      description: 'A weather application that provides real-time weather updates.',
      technologies: ['React', 'OpenWeatherMap API'],
      sourceCode: '/projects/sourceCode.zip',
      demoLink: 'https://demo.com',
      image: '/projects/weather-app.png',
      githubLink: 'https://github.com/yourusername/ecommerce',
      env: `API_KEY=your_api_key_here\nDATABASE_URL=your_database_url_here`,
      password: 'sourcecode_password123'
    },
    {
      title: 'Chat Application',
      description: 'A real-time chat application using WebSocket technology.',
      technologies: ['React', 'Node.js', 'Socket.io'],
      sourceCode: '/projects/sourceCode.zip',
      demoLink: 'https://demo.com',
      image: '/projects/chat-app.png',
      githubLink: 'https://github.com/yourusername/ecommerce',
      env: `API_KEY=your_api_key_here\nDATABASE_URL=your_database_url_here`,
      password: 'sourcecode_password123'
    },
    {
      title: 'Recipe Finder',
      description: 'A recipe search application using the Edamam API.',
      technologies: ['React', 'Edamam API'],
      sourceCode: '/projects/sourceCode.zip',
      demoLink: 'https://demo.com',
      image: '/projects/recipe-finder.png',
      githubLink: 'https://github.com/yourusername/ecommerce',
      env: `API_KEY=your_api_key_here\nDATABASE_URL=your_database_url_here`,
      password: 'sourcecode_password123'
    },
    {
      title: 'Expense Tracker',
      description: 'A personal finance tracker to manage expenses and income.',
      technologies: ['React', 'Firebase'],
      sourceCode: '/projects/sourceCode.zip',
      demoLink: 'https://demo.com',
      image: '/projects/expense-tracker.webp',
      githubLink: 'https://github.com/yourusername/ecommerce',
      env: `API_KEY=your_api_key_here\nDATABASE_URL=your_database_url_here`,
      password: 'sourcecode_password123'
    }
  ]

  for (const project of projects) {
    await prisma.project.create({ data: project })
  }

  console.log('✅ Projects seeding finished.')
}
