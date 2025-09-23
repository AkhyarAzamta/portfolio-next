// app/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loading } from '@/components/ui/loading'
import { User } from '@/types'

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include', // ensures cookies are sent
        });
        if (response.status === 401) {
          // Token tidak valid, redirect ke login
          router.push('/login')
          return
        }

        if (!response.ok) {
          throw new Error('Failed to fetch user data')
        }

        const userData = await response.json()
        setUser(userData)
      } catch (error) {
        console.error('Authentication error:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  const handleLogout = () => {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    router.push('/login')
  }

  if (loading) {
    return (
      <Loading size={150} blur="sm" />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark">
      <header className="bg-white dark:bg-dark/50 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-semibold">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span>Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="text-primary hover:text-primary/80"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user?.role === 'ADMIN' && (
              <>
                <Link href="/dashboard/blogs" className="bg-white dark:bg-dark/50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <h2 className="text-lg font-semibold mb-2">Manage Blogs</h2>
                  <p>Create, edit, and manage blog posts</p>
                </Link>
                <Link href="/dashboard/projects" className="bg-white dark:bg-dark/50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <h2 className="text-lg font-semibold mb-2">Manage Projects</h2>
                  <p>Manage your portfolio projects</p>
                </Link>
                <Link href="/dashboard/about" className="bg-white dark:bg-dark/50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <h2 className="text-lg font-semibold mb-2">Manage About</h2>
                  <p>Update your about section</p>
                </Link>
                <Link href="/dashboard/contact-messages" className="bg-white dark:bg-dark/50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <h2 className="text-lg font-semibold mb-2">Contact Messages</h2>
                  <p>View and manage contact messages</p>
                </Link>
              </>
            )}
            {user?.role === 'USER' && (
              <Link href="/dashboard/blogs" className="bg-white dark:bg-dark/50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h2 className="text-lg font-semibold mb-2">My Blogs</h2>
                <p>Create and manage your blog posts</p>
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}