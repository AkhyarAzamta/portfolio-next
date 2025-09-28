// app/dashboard/projects/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal, Edit, Trash2, Plus, Github, FileText, Key } from 'lucide-react'
import Image from 'next/image'
import { Loading } from '@/components/ui/loading'
import type { Project as ProjectType } from '@/types'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { toast } from 'sonner'

interface Project extends ProjectType {
  id: string // Changed from number to string
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const router = useRouter()

  useEffect(() => {
    const getProjects = async () => {
      try {
        const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1]
        const response = await fetch('/api/admin/projects', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            router.push('/login')
            return
          }
          throw new Error('Failed to fetch projects')
        }

        const data = await response.json()
        setProjects(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    getProjects()
  }, [router])

  const confirmDelete = async () => {
    if (!selectedId) return
    try {
      const token = document.cookie.split('; ')
        .find(row => row.startsWith('token='))?.split('=')[1]

      const response = await fetch(`/api/admin/projects/${selectedId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        toast.error('Failed to delete project')
        throw new Error('Failed to delete project')
      }

      setProjects(prev => prev.filter(project => project.id !== selectedId))
      setSelectedId(null)
      toast.success('Project deleted successfully')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'An error occurred')
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setConfirmOpen(false)
    }
  }


  const handleDeleteClick = (id: string) => {
    setSelectedId(id)
    setConfirmOpen(true)
  }


  const copyToClipboard = async (text: string | null, type: string) => {
    if (!text) {
      alert(`No ${type} available to copy`)
      return
    }

    try {
      await navigator.clipboard.writeText(text)
      alert(`${type} copied to clipboard!`)
    } catch (err) {
      console.error('Failed to copy:', err)
      alert('Failed to copy to clipboard')
    }
  }

  if (loading) {
    return <Loading size={150} blur="sm" />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 text-text">
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete Project"
        description="Are you sure you want to delete this project? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
      />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Projects</h1>
        <Button onClick={() => router.push('/dashboard/projects/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Project
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
          <CardDescription>
            Manage your portfolio projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No projects found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Technologies</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <div className="h-12 w-12 relative">
                        {project.image ? (
                          <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            sizes="100px"
                            className="object-cover rounded-md"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder-image.png'
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                            <span className="text-xs text-gray-500">No Image</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{project.title}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.slice(0, 3).map((tech, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-background">
                            {tech}
                          </Badge>
                        ))}
                        {project.technologies.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{project.technologies.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {project.price
                        ? new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          minimumFractionDigits: 0,
                        }).format(project.price)
                        : 'Free'}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {project.archived ? (
                          <Badge variant="secondary" className="text-xs">
                            Archived
                          </Badge>
                        ) : (
                          <Badge variant="default" className="text-xs">
                            Active
                          </Badge>
                        )}
                      </div>
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
                          <DropdownMenuItem
                            onClick={() => router.push(`/dashboard/projects/edit/${project.id}`)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          {project.githubLink && (
                            <DropdownMenuItem
                              onClick={() => copyToClipboard(project.githubLink, 'GitHub Link')}
                            >
                              <Github className="h-4 w-4 mr-2" />
                              Copy GitHub Link
                            </DropdownMenuItem>
                          )}
                          {project.env && (
                            <DropdownMenuItem
                              onClick={() => copyToClipboard(project.env, 'Environment Variables')}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Copy Env
                            </DropdownMenuItem>
                          )}
                          {project.password && (
                            <DropdownMenuItem
                              onClick={() => copyToClipboard(project.password, 'Password')}
                            >
                              <Key className="h-4 w-4 mr-2" />
                              Copy Password
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(project.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}