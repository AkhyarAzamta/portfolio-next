// app/dashboard/projects/new/page.tsx
'use client'

import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { ImageUpload } from '@/components/ImageUpload'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileUpload } from '@/components/FileUpload'
import { parsePrice, formatPriceRealTime } from '@/utils/currency'
import { Project } from '@/types'
import { toast } from 'sonner'

type NewProjectFormData = Omit<Project, 'id' | 'createdAt' | 'updatedAt'>

export default function NewProjectPage() {
  const [formData, setFormData] = useState<NewProjectFormData>({
    title: '',
    description: '',
    technologies: [],
    sourceCode: null,
    demoLink: null,
    image: '',
    archived: false,
    price: null,
    githubLink: null,
    env: null,
    password: null,
  })

  const [techInput, setTechInput] = useState<string>('')
  const [priceInput, setPriceInput] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const priceInputRef = useRef<HTMLInputElement>(null)
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

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    
    // Simpan nilai asli (numerik) ke formData
    const parsedPrice = parsePrice(value)
    setFormData(prev => ({
      ...prev,
      price: parsedPrice,
    }))
    
    // Format nilai untuk ditampilkan
    setPriceInput(formatPriceRealTime(value))
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

      const payload = {
        ...formData,
        // Ensure empty strings are converted to null
        githubLink: formData.githubLink || null,
        env: formData.env || null,
        password: formData.password || null,
        demoLink: formData.demoLink || null,
        sourceCode: formData.sourceCode || null,
      }

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
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || data.message || 'Failed to create project')
      }

      toast.success('Project created successfully')
      router.push('/dashboard/projects')
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
        toast.error(err.message)
      } else {
        setError('An unknown error occurred')
        toast.error('An unknown error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 text-text">
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

            {/* GitHub Link */}
            <div className="space-y-2">
              <Label htmlFor="githubLink">GitHub Link (Admin Only)</Label>
              <Input
                id="githubLink"
                type="url"
                value={formData.githubLink ?? ''}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, githubLink: e.target.value }))
                }
                placeholder="https://github.com/username/repo"
              />
            </div>

            {/* Environment Variables */}
            <div className="space-y-2">
              <Label htmlFor="env">Environment Variables (Admin Only)</Label>
              <Textarea
                id="env"
                value={formData.env ?? ''}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, env: e.target.value }))
                }
                rows={3}
                placeholder="API_KEY=your_api_key_here"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Source Code Password (Admin Only)</Label>
              <Input
                id="password"
                type="text"
                value={formData.password ?? ''}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, password: e.target.value }))
                }
                placeholder="Password for source code archive"
              />
            </div>

            {/* Price - DIPERBAIKI dengan format real-time */}
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                ref={priceInputRef}
                type="text"
                value={priceInput}
                onChange={handlePriceChange}
                placeholder="Contoh: Rp 250.000"
                autoComplete="off"
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
                <Label
                  htmlFor="archived"
                  className="hover:bg-accept/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950"
                >
                  <Checkbox
                    id="archived"
                    checked={formData.archived}
                    onCheckedChange={(checked: boolean | 'indeterminate') =>
                      setFormData((p) => ({ ...p, archived: checked === true }))
                    }
                    className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                  />
                  <div className="grid gap-1.5 font-normal">
                    <p className="text-sm leading-none font-medium">Archived</p>
                    <p className="text-muted-foreground text-sm">
                      You can enable or disable Archived at any time.
                    </p>
                  </div>
                </Label>
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