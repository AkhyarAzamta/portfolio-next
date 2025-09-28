// app/dashboard/blogs/page.tsx
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
import { MoreHorizontal, Edit, Trash2, Plus, Eye, EyeOff, FileText } from 'lucide-react'
import { Loading } from '@/components/ui/loading'
import { Blog } from '@/types'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/ConfirmDialog'

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchBlogs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchBlogs = async () => {
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1]
      const response = await fetch('/api/admin/blogs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          router.push('/login')
          return
        }
        throw new Error('Failed to fetch blogs')
      }

      const data = await response.json()
      setBlogs(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const confirmDelete = async () => {
    if (!selectedId) return

    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1]
      const response = await fetch(`/api/admin/blogs/${selectedId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete blog')
      }

      setBlogs(blogs.filter(blog => blog.id !== selectedId))
      setSelectedId(null)
      setConfirmOpen(false)
      toast.success('Blog deleted successfully')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'An error occurred')
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1]
      const response = await fetch(`/api/admin/blogs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          published: !currentStatus
        })
      })

      if (!response.ok) {
        toast.error('Failed to update blog')
        throw new Error('Failed to update blog')
      }
      toast.success(`Blog ${!currentStatus ? 'published' : 'unpublished'} successfully`)
      fetchBlogs()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      toast.error(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const handleDeleteClick = (id: string) => {
    setSelectedId(id)
    setConfirmOpen(true)
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
        title="Delete Blog"
        description="Are you sure you want to delete this blog? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
      />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Blogs</h1>
        <Button onClick={() => router.push('/dashboard/blogs/new')}>
          <Plus className="h-4 w-4 mr-2" />
          New Blog
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Blog Posts</CardTitle>
          <CardDescription>
            Manage your blog posts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {blogs.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No blog posts found.</p>
              <Button
                className="mt-4"
                onClick={() => router.push('/dashboard/blogs/new')}
              >
                Create Your First Blog Post
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Excerpt</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogs.map((blog) => (
                  <TableRow key={blog.id}>
                    <TableCell className="font-medium">{blog.title}</TableCell>
                    <TableCell className="max-w-xs truncate">{blog.excerpt}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {blog.published ? (
                          <Badge variant="default" className="text-xs">
                            Published
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            Draft
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(blog.createdAt).toLocaleDateString()}
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
                            onClick={() => router.push(`/dashboard/blogs/view/${blog.id}`)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => router.push(`/dashboard/blogs/edit/${blog.id}`)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => togglePublish(blog.id, blog.published)}
                          >
                            {blog.published ? (
                              <>
                                <EyeOff className="h-4 w-4 mr-2" />
                                Unpublish
                              </>
                            ) : (
                              <>
                                <Eye className="h-4 w-4 mr-2" />
                                Publish
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(blog.id)}
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