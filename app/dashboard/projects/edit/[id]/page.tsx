// app/dashboard/projects/edit/[id]/page.tsx
'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { ImageUpload } from '@/components/ImageUpload'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loading } from '@/components/ui/loading'
import { FileUpload } from '@/components/FileUpload'
import { parsePrice, formatPriceRealTime } from '@/utils/currency'

interface Project {
  id: string // Changed from number to string
  title: string
  description: string
  technologies: string[]
  sourceCode: string | null
  demoLink: string | null
  image: string
  archived: boolean
  price: number | null
  githubLink: string | null // New field
  env: string | null // New field
  password: string | null // New field
  createdAt: string
  updatedAt: string
}

export default function EditProjectPage() {
  const [formData, setFormData] = useState<Project>({
    id: '',
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
    createdAt: '',
    updatedAt: '',
  })
  const [techInput, setTechInput] = useState('')
  const [priceInput, setPriceInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const priceInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const fetchProject = useCallback(async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1]

      const response = await fetch(`/api/admin/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch project')
      }

      const project: Project = await response.json()
      setFormData(project)
      
      // Format harga awal
      if (project.price) {
        setPriceInput(formatPriceRealTime(project.price.toString()))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }, [id])

  useEffect(() => {
    if (id) {
      fetchProject()
    }
  }, [id, fetchProject])

  const handleAddTech = () => {
    const tech = techInput.trim()
    if (tech && !formData.technologies.includes(tech)) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, tech],
      })
      setTechInput('')
    }
  }

  const handleRemoveTech = (tech: string) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter((t) => t !== tech),
    })
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    
    // Simpan nilai asli (numerik) ke formData
    const parsedPrice = parsePrice(value)
    setFormData({
      ...formData,
      price: parsedPrice,
    })
    
    // Format nilai untuk ditampilkan
    setPriceInput(formatPriceRealTime(value))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1]

      const response = await fetch(`/api/admin/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update project')
      }

      router.push('/dashboard/projects')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size={150} blur="sm" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Project</CardTitle>
          <CardDescription>Update your project details</CardDescription>
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
                  setFormData({ ...formData, title: e.target.value })
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
                  setFormData({ ...formData, description: e.target.value })
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
                value={formData.sourceCode || ''}
                onChange={(url) =>
                  setFormData({ ...formData, sourceCode: url })
                }
              />
            </div>

            {/* Demo Link */}
            <div className="space-y-2">
              <Label htmlFor="demoLink">Demo Link</Label>
              <Input
                id="demoLink"
                type="url"
                value={formData.demoLink || ''}
                onChange={(e) =>
                  setFormData({ ...formData, demoLink: e.target.value })
                }
              />
            </div>

            {/* GitHub Link */}
            <div className="space-y-2">
              <Label htmlFor="githubLink">GitHub Link (Admin Only)</Label>
              <Input
                id="githubLink"
                type="url"
                value={formData.githubLink || ''}
                onChange={(e) =>
                  setFormData({ ...formData, githubLink: e.target.value })
                }
                placeholder="https://github.com/username/repo"
              />
            </div>

            {/* Environment Variables */}
            <div className="space-y-2">
              <Label htmlFor="env">Environment Variables (Admin Only)</Label>
              <Textarea
                id="env"
                value={formData.env || ''}
                onChange={(e) =>
                  setFormData({ ...formData, env: e.target.value })
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
                value={formData.password || ''}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Password for source code archive"
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                ref={priceInputRef}
                type="text"
                value={priceInput}
                onChange={handlePriceChange}
                placeholder="Contoh: Rp 250.000"
                autoComplete='off'
              />
            </div>

            {/* Image */}
            <div className="space-y-2">
              <Label>Project Image</Label>
              <ImageUpload
                value={formData.image}
                onChange={(imageUrl) =>
                  setFormData({ ...formData, image: imageUrl })
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
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        archived: checked === true,
                      })
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

            {error && <div className="text-red-500 text-sm">{error}</div>}

            {/* Actions */}
            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update Project'}
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