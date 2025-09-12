// prisma/seed/blogs.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function seedBlogs() {
  console.log('🌱 Seeding blogs...')

  // Get the first user to use as author
  const author = await prisma.user.findFirst()
  if (!author) {
    throw new Error('No users found. Please seed users first.')
  }

  await prisma.blog.deleteMany() // Clear existing data

  const blogs = [
    {
      title: 'Getting Started with Next.js 14',
      excerpt: 'Learn about the new features and improvements in Next.js 14.',
      content: 'This is the full content of the blog post about Next.js 14...',
      authorId: author.id,
      slug: 'getting-started-with-nextjs-14',
      published: true,
    },
    {
      title: 'Mastering TypeScript for React',
      excerpt: 'A comprehensive guide to using TypeScript with React applications.',
      content: 'This is the full content of the blog post about TypeScript and React...',
      authorId: author.id,
      slug: 'mastering-typescript-for-react',
      published: true,
    },
    {
      title: 'Building Responsive Layouts with Tailwind CSS',
      excerpt: 'Tips and tricks for creating responsive designs using Tailwind CSS.',
      content: 'This is the full content of the blog post about Tailwind CSS...',
      authorId: author.id,
      slug: 'building-responsive-layouts-with-tailwind-css',
      published: true,
    },
    {
      title: 'Understanding React Hooks',
      excerpt: 'A deep dive into React Hooks and how to use them effectively.',
      content: 'This is the full content of the blog post about React Hooks...',
      authorId: author.id,
      slug: 'understanding-react-hooks',
      published: true,
    },
    {
      title: 'Deploying Next.js Applications on Vercel',
      excerpt: 'Step-by-step guide to deploying your Next.js applications on Vercel.',
      content: 'This is the full content of the blog post about deploying to Vercel...',
      authorId: author.id,
      slug: 'deploying-nextjs-applications-on-vercel',
      published: true,
    },
    {
      title: 'Building a RESTful API with Node.js and Express',
      excerpt: 'Learn how to create a RESTful API using Node.js and Express.',
      content: 'This is the full content of the blog post about building APIs with Node.js...',
      authorId: author.id,
      slug: 'building-a-restful-api-with-nodejs-and-express',
      published: true,
    },
  ]

  for (const blog of blogs) {
    await prisma.blog.create({
      data: blog,
    })
  }

  console.log('✅ Blogs seeding finished.')
}