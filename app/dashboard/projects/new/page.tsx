// app/dashboard/projects/new/page.tsx
'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { ImageUpload } from '@/components/ImageUpload'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileUpload } from '@/components/FileUpload'
import type { ProjectCreateInput, ApiErrorResponse } from '@/types'

type FormState = Omit<ProjectCreateInput, 'price'> & {
  priceInput: string
}

export default function NewProjectPage() {
  const [formData, setFormData] = useState<FormState>({
    title: '',
    description: '',
    technologies: [],
    sourceCode: null,
    demoLink: null,
    image: '',
    priceInput: '',
    archived: false,
  })

  const [techInput, setTechInput] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const router = useRouter()

  const handleAddTech = () => {
    const t = techInput.trim()
    if (t && !formData.technologies.includes(t)) {
      setFormData((prev) => ({ ...prev, technologies: [...prev.technologies, t] }))
      setTechInput('')
    }
  }

  const handleRemoveTech = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((t) => t !== tech),
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!formData.title.trim() || !formData.description.trim()) {
        setError('Title and description are required.')
        setLoading(false)
        return
      }

      let price: number | null = null
      if (formData.priceInput.trim() !== '') {
        const parsed = Number(formData.priceInput)
        price = Number.isFinite(parsed) ? parsed : null
      }

      const payload: ProjectCreateInput = {
        ...formData,
        price,
      }

      // Ambil token dari cookie
      const tokenCookie = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
      const token = tokenCookie ? tokenCookie.split('=')[1] : undefined

      const response = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data: ApiErrorResponse = await response.json().catch(() => ({}))
        throw new Error(data.error || data.message || 'Failed to create project')
      }

      router.push('/dashboard/projects')
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unknown error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Add New Project</CardTitle>
          <CardDescription>Create a new project for your portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, title: e.target.value }))
                }
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, description: e.target.value }))
                }
                rows={4}
                required
              />
            </div>

            {/* Technologies */}
            <div className="space-y-2">
              <Label htmlFor="technologies">Technologies</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  placeholder="Add a technology"
                />
                <Button type="button" onClick={handleAddTech}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.technologies.map((tech) => (
                  <div
                    key={tech}
                    className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => handleRemoveTech(tech)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Source Code */}
            <div className="space-y-2">
              <Label>Source Code (ZIP/RAR)</Label>
              <FileUpload
                value={formData.sourceCode ?? ''}
                onChange={(url: string) =>
                  setFormData((p) => ({ ...p, sourceCode: url || null }))
                }
              />
            </div>

            {/* Demo Link */}
            <div className="space-y-2">
              <Label htmlFor="demoLink">Demo Link</Label>
              <Input
                id="demoLink"
                type="url"
                value={formData.demoLink ?? ''}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, demoLink: e.target.value }))
                }
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.priceInput}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, priceInput: e.target.value }))
                }
                placeholder="Leave empty for free / not for sale"
              />
            </div>

            {/* Project Image */}
            <div className="space-y-2">
              <Label>Project Image</Label>
              <ImageUpload
                value={formData.image}
                onChange={(imageUrl: string) =>
                  setFormData((p) => ({ ...p, image: imageUrl }))
                }
              />
            </div>

            {/* Archived */}
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="archived"
                  checked={formData.archived}
                  onCheckedChange={(checked: boolean | 'indeterminate') =>
                    setFormData((p) => ({ ...p, archived: checked === true }))
                  }
                />
                <Label htmlFor="archived">Archived</Label>
              </div>
            </div>

            {/* Error */}
            {error && <div className="text-red-500 text-sm">{error}</div>}

            {/* Buttons */}
            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Project'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard/projects')}
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
