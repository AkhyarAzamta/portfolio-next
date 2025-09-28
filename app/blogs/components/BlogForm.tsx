// app/dashboard/blogs/components/BlogForm.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import RichTextEditor from '@/components/RichTextEditor'
import { Loader2, Save, ArrowLeft } from 'lucide-react'
import { BlogFormProps } from '@/types'

export default function BlogForm({ blog }: BlogFormProps) {
  const [formData, setFormData] = useState({
    title: blog?.title || '',
    excerpt: blog?.excerpt || '',
    content: blog?.content || '',
    published: blog?.published || false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title,
        excerpt: blog.excerpt,
        content: blog.content,
        published: blog.published,
      })
    }
  }, [blog])

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)
  setError('')

  try {
    if (!formData.title.trim() || !formData.excerpt.trim()) {
      setError('Title and excerpt are required.')
      setLoading(false)
      return
    }

    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1]
    if (!token) {
      setError("Unauthorized: No token found")
      setLoading(false)
      return
    }

    const url = blog 
      ? `/api/admin/blogs/${blog.id}`
      : '/api/admin/blogs'
    const method = blog ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    })

    if (!response.ok) {
      let errorMessage = 'Failed to save blog'
      try {
        const data = await response.json()
        if (data?.error) errorMessage = data.error
      } catch {
        // ignore kalau bukan JSON
      }
      throw new Error(errorMessage)
    }

    router.push('/dashboard/blogs')
  } catch (err) {
    setError(err instanceof Error ? err.message : 'An error occurred')
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="container mx-auto px-4 py-8 text-text">
      <div className="flex items-center mb-6">
        <Button
          // variant="outline"
          onClick={() => router.push('/dashboard/blogs')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">
          {blog ? 'Edit Blog' : 'Create New Blog'}
        </h1>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Blog Details</CardTitle>
          <CardDescription>
            {blog ? 'Edit your blog post' : 'Create a new blog post'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter blog title"
                required
              />
            </div>

            {/* Excerpt */}
            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt *</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Enter a short excerpt"
                rows={3}
                required
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <RichTextEditor
                content={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
                placeholder="Write your blog content here..."
              />
            </div>

            {/* Status Options */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, published: checked === true })
                  }
                />
                <Label htmlFor="published">Published</Label>
              </div>

            {/* Error */}
            {error && <div className="text-red-500 text-sm">{error}</div>}

            {/* Buttons */}
            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Blog
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard/blogs')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}