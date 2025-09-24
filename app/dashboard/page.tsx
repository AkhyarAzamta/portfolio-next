// app/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Blog, Certificate, Project, User } from '@/types'
import { 
  DocumentTextIcon, 
  CodeBracketIcon, 
  EnvelopeIcon, 
  UserCircleIcon,
  PlusIcon,
  EyeIcon,
  PencilSquareIcon,
  ArrowUpRightIcon
} from '@heroicons/react/24/outline'

// Shadcn/ui components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'

type RecentItem = Partial<Blog> | Partial<Project> | Partial<Contact> | Partial<Certificate>

interface Contact {
  id: number;
  name: string;
  email: string;
  read: boolean;
  date: string;
}

interface DashboardStats {
  totalBlogs: number
  totalProjects: number
  totalContacts: number
  unreadContacts: number
  recentBlogs: { id: number; title: string; published: boolean; createdAt: string; slug?: string }[]
  recentProjects: { id: number; title: string; status: string; createdAt: string; slug?: string }[]
  recentContacts: { id: number; name: string; email: string; read: boolean; date: string }[]
}

// Color classes for fresh look
const colorClasses = {
  blue: 'bg-[var(--color-blue-bg)] border-[var(--color-blue-border)]',
  green: 'bg-[var(--color-green-bg)] border-[var(--color-green-border)]',
  purple: 'bg-[var(--color-purple-bg)] border-[var(--color-purple-border)]'
}

const textColorClasses = {
  blue: 'text-[var(--color-blue-text)]',
  green: 'text-[var(--color-green-text)]',
  purple: 'text-[var(--color-purple-text)]'
}

const iconColorClasses = {
  blue: 'text-[var(--color-blue-icon)]',
  green: 'text-[var(--color-green-icon)]',
  purple: 'text-[var(--color-purple-icon)]'
}


export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<DashboardStats>({
    totalBlogs: 0,
    totalProjects: 0,
    totalContacts: 0,
    unreadContacts: 0,
    recentBlogs: [],
    recentProjects: [],
    recentContacts: []
  })
  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
        })
        
        if (response.status === 401) {
          router.push('/login')
          return
        }

        if (!response.ok) {
          throw new Error('Failed to fetch user data')
        }

        const userData = await response.json()
        setUser(userData)
        
        await fetchDashboardStats()
      } catch (error) {
        console.error('Authentication error:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  const fetchDashboardStats = async () => {
    try {
      setStatsLoading(true)
      
      const [blogsResponse, projectsResponse, contactsResponse] = await Promise.all([
        fetch('/api/blogs?limit=5'),
        fetch('/api/projects?limit=5'),
        fetch('/api/contacts?limit=5')
      ])

      const blogsData = blogsResponse.ok ? await blogsResponse.json() : []
      const projectsData = projectsResponse.ok ? await projectsResponse.json() : []
      const contactsData = contactsResponse.ok ? await contactsResponse.json() : []

      setStats({
        totalBlogs: blogsData.total || blogsData.length || 0,
        totalProjects: projectsData.total || projectsData.length || 0,
        totalContacts: contactsData.total || contactsData.length || 0,
        unreadContacts: contactsData.filter((contact: Contact) => !contact.read).length || 0,
        recentBlogs: Array.isArray(blogsData) ? blogsData.slice(0, 3) : (blogsData.blogs || []).slice(0, 3),
        recentProjects: Array.isArray(projectsData) ? projectsData.slice(0, 3) : (projectsData.projects || []).slice(0, 3),
        recentContacts: Array.isArray(contactsData) ? contactsData.slice(0, 3) : (contactsData.contacts || []).slice(0, 3)
      })
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setStatsLoading(false)
    }
  }

const StatCard = ({ 
  title, 
  value, 
  description,
  icon: Icon, 
  trend,
  href,
  color = 'blue'
}: { 
  title: string
  value: React.ReactNode
  description?: string
  icon: React.ElementType
  trend?: { value: number; isPositive: boolean }
  href?: string
  color?: 'blue' | 'green' | 'purple'
}) => {
  const card = (
    <Card className={`relative overflow-hidden transition-all hover:shadow-md ${colorClasses[color]}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${iconColorClasses[color]}`} />
          <CardTitle className={`text-sm font-medium ${textColorClasses[color]}`}>
            {title}
          </CardTitle>
        </div>
<ArrowUpRightIcon className="h-3 w-3" />
      </CardHeader>

      <CardContent>
        <div className={`text-2xl font-bold ${textColorClasses[color]}`}>
          {value}
        </div>
        {description && (
          <p className={`text-xs ${textColorClasses[color]} opacity-80`}>
            {description}
          </p>
        )}
        {trend && (
          <div className={`text-xs ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last month
          </div>
        )}
      </CardContent>
    </Card>
  )

  return href ? (
    <Link href={href} className="block hover:scale-105 transition-transform" aria-label={title}>
      {card}
    </Link>
  ) : (
    card
  )
}

  const QuickActionCard = ({ 
    title, 
    description, 
    icon: Icon, 
    href,
    color = 'blue'
  }: { 
    title: string
    description: string
    icon: React.ElementType
    href: string
    color?: 'blue' | 'green' | 'purple'
  }) => (
    <Card className={`transition-all hover:shadow-md ${colorClasses[color]}`}>
      <CardContent className="p-6">
        <Link href={href} className="flex items-center gap-4 group">
          <div className={`p-3 rounded-lg bg-white dark:bg-gray-800 ${colorClasses[color]}`}>
            <Icon className={`h-6 w-6 ${iconColorClasses[color]}`} />
          </div>
          <div className="flex-1 space-y-1">
            <p className={`font-medium leading-none ${textColorClasses[color]}`}>
              {title}
            </p>
            <p className={`text-sm ${textColorClasses[color]} opacity-80`}>
              {description}
            </p>
          </div>
          <PlusIcon className={`h-4 w-4 ${iconColorClasses[color]} group-hover:scale-110 transition-transform`} />
        </Link>
      </CardContent>
    </Card>
  )

  const RecentTable = <T extends RecentItem>({ 
    data, 
    title, 
    type,
    href,
    color = 'blue'
  }: {
    data: T[]
    title: string
    type: 'blog' | 'project' | 'contact' | 'certificate'
    href: string
    color?: 'blue' | 'green' | 'purple'
  }) => {
    const getStatusBadge = (item: T) => {
      switch (type) {
        case 'blog':
          return (item as Blog).published ? (
            <Badge variant="default">Published</Badge>
          ) : (
            <Badge variant="secondary">Draft</Badge>
          )
        case 'project':
          return (item as Project).archived ? (
            <Badge variant="outline">Archived</Badge>
          ) : (
            <Badge variant="default">Active</Badge>
          )
        case 'contact':
          return (item as Contact).read ? (
            <Badge variant="secondary">Read</Badge>
          ) : (
            <Badge variant="default">New</Badge>
          )
        default:
          return null
      }
    }

    const getItemTitle = (item: T) => {
      switch (type) {
        case 'blog': return (item as Blog).title
        case 'project': return (item as Project).title
        case 'contact': return (item as Contact).name || (item as Contact).email
        default: return (item as Certificate).name
      }
    }

    const getItemDate = (item: T) => {
      const date =
        (item as Blog).createdAt ||
        (item as Project).createdAt ||
        (item as Contact).date ||
        new Date().toISOString()

      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    return (
      <Card className={colorClasses[color]}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className={`text-lg ${textColorClasses[color]}`}>
              {title}
            </CardTitle>
            <CardDescription className={textColorClasses[color]}>
              Recently updated {type}s
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className={textColorClasses[color]}
            asChild
          >
            <Link href={href}>View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={textColorClasses[color]}>Name</TableHead>
                <TableHead className={textColorClasses[color]}>Status</TableHead>
                <TableHead className={textColorClasses[color]}>Date</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-4">
                    No {type}s found
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item, index) => (
                  <TableRow key={index} className="hover:bg-opacity-50">
                    <TableCell className={`font-medium ${textColorClasses[color]}`}>
                      {getItemTitle(item)}
                    </TableCell>
                    <TableCell>{getStatusBadge(item)}</TableCell>
                    <TableCell className={textColorClasses[color]}>
                      {getItemDate(item)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/${type}s/${item.id}`}>
                              <PencilSquareIcon className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href={
                                `/${type}s/` +
                                (
                                  type === 'blog' || type === 'project'
                                    ? ((item as Blog | Project).slug ?? item.id)
                                    : item.id
                                )
                              }
                              target="_blank"
                            >
                              <EyeIcon className="h-4 w-4 mr-2" />
                              View
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-4 w-[250px]" />
          <div className="flex space-x-4">
            <Skeleton className="h-32 w-32" />
            <Skeleton className="h-32 w-32" />
            <Skeleton className="h-32 w-32" />
            <Skeleton className="h-32 w-32" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {user?.name}! Here&apos;s what&apos;s happening today.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant={user?.role === 'ADMIN' ? 'default' : 'secondary'}>
                {user?.role}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Statistics Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Blogs"
            value={statsLoading ? <Skeleton className="h-7 w-12" /> : stats.totalBlogs}
            description="Published blog posts"
            icon={DocumentTextIcon}
            href="/dashboard/blogs"
            color="blue"
          />
          <StatCard
            title="Total Projects"
            value={statsLoading ? <Skeleton className="h-7 w-12" /> : stats.totalProjects}
            description="Portfolio projects"
            icon={CodeBracketIcon}
            href="/dashboard/projects"
            color="green"
          />
          <StatCard
            title="Contact Messages"
            value={statsLoading ? <Skeleton className="h-7 w-12" /> : stats.totalContacts}
            description={`${stats.unreadContacts} unread`}
            icon={EnvelopeIcon}
            href="/dashboard/contacts"
            color="purple"
          />
          <StatCard
            title="Profile Views"
            value="1,254"
            description="This month"
            icon={UserCircleIcon}
            trend={{ value: 12, isPositive: true }}
            color="blue"
          />
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-4">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <QuickActionCard
              title="Create New Blog"
              description="Write and publish a new blog post"
              icon={DocumentTextIcon}
              href="/dashboard/blogs/new"
              color="blue"
            />
            <QuickActionCard
              title="Add Project"
              description="Showcase a new project in your portfolio"
              icon={CodeBracketIcon}
              href="/dashboard/projects/new"
              color="green"
            />
            <QuickActionCard
              title="Update About"
              description="Edit your profile information"
              icon={UserCircleIcon}
              href="/dashboard/about"
              color="purple"
            />
          </div>
        </div>

        {/* Recent Activity Grid */}
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          <RecentTable
            title="Recent Blogs"
            data={stats.recentBlogs}
            type="blog"
            href="/dashboard/blogs"
            color="blue"
          />
          <RecentTable
            title="Recent Projects"
            data={stats.recentProjects}
            type="project"
            href="/dashboard/projects"
            color="green"
          />
          <RecentTable
            title="Recent Contacts"
            data={stats.recentContacts}
            type="contact"
            href="/dashboard/contacts"
            color="purple"
          />
        </div>

        {/* Admin Only Sections */}
        {user?.role === 'ADMIN' && (
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-4">Admin Tools</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className={`transition-all hover:shadow-md ${colorClasses.blue}`}>
                <CardHeader>
                  <CardTitle className={`text-lg ${textColorClasses.blue}`}>User Management</CardTitle>
                  <CardDescription className={textColorClasses.blue}>Manage system users</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className={`w-full ${textColorClasses.blue}`}>
                    <Link href="/dashboard/users">Manage Users</Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card className={`transition-all hover:shadow-md ${colorClasses.green}`}>
                <CardHeader>
                  <CardTitle className={`text-lg ${textColorClasses.green}`}>Site Settings</CardTitle>
                  <CardDescription className={textColorClasses.green}>Configure website settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className={`w-full ${textColorClasses.green}`}>
                    <Link href="/dashboard/settings">Settings</Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card className={`transition-all hover:shadow-md ${colorClasses.purple}`}>
                <CardHeader>
                  <CardTitle className={`text-lg ${textColorClasses.purple}`}>Analytics</CardTitle>
                  <CardDescription className={textColorClasses.purple}>View site statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className={`w-full ${textColorClasses.purple}`}>
                    <Link href="/dashboard/analytics">View Analytics</Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card className={`transition-all hover:shadow-md ${colorClasses.blue}`}>
                <CardHeader>
                  <CardTitle className={`text-lg ${textColorClasses.blue}`}>Backup</CardTitle>
                  <CardDescription className={textColorClasses.blue}>Manage data backups</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className={`w-full ${textColorClasses.blue}`}>
                    <Link href="/dashboard/backup">Backup Data</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}