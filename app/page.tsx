// app/page.tsx
import Blogs from "@/app/blogs/components/Blogs";
import Hero from "@/components/Hero";
import Newsletter from "@/components/Newsletter";
import Projects from "@/app/projects/page";
import About from "./about/page";
import { User as AdminUser } from '@/types'

async function getAdminUser(): Promise<AdminUser | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users?role=ADMIN`, {
      next: { revalidate: 120 }
    })
    
    if (!res.ok) {
      throw new Error('Failed to fetch users')
    }
    
    const users: AdminUser[] = await res.json()
    return users.find((user: AdminUser) => user.role === 'ADMIN') || null
  } catch (error) {
    console.error('Error fetching admin user:', error)
    return null
  }
}

export default async function Home() {
  const adminUser = await getAdminUser()
  
  return (
    <>
      <Hero initialAdminUser={adminUser} />
      <About />
      <Projects 
        limit={3} 
        title="Featured Projects" 
        description="Here are some of my recent projects. Click on the links to view the code or live demo."
        showViewAll={true}
      />
      <Blogs limit={3} title="Latest Blog Posts" showViewAll={true} />
      <Newsletter />
    </>
  );
}