// app/dashboard/projects/edit/[id]/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { ImageUpload } from '@/components/ImageUpload'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Project {
  id: number
  title: string
  description: string
  technologies: string[]
  githubLink: string | null
  demoLink: string | null
  image: string
  freeToUse: boolean
  featured: boolean
}

export default function EditProjectPage() {
  const [formData, setFormData] = useState<Project>({
    id: 0,
    title: '',
    description: '',
    technologies: [],
    githubLink: '',
    demoLink: '',
    image: '',
    freeToUse: false,
    featured: false
  })
  const [techInput, setTechInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const fetchProject = useCallback(async () => {
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1]
      const response = await fetch(`/api/admin/projects/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch project')
      }

      const project = await response.json()
      setFormData(project)
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
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput.trim()]
      })
      setTechInput('')
    }
  }

  const handleRemoveTech = (tech: string) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter(t => t !== tech)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1]
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
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

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Project</CardTitle>
          <CardDescription>
            Update your project details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="technologies">Technologies</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  placeholder="Add a technology"
                />
                <Button
                  type="button"
                  onClick={handleAddTech}
                >
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

            <div className="space-y-2">
              <Label htmlFor="githubLink">GitHub Link</Label>
              <Input
                id="githubLink"
                type="url"
                value={formData.githubLink || ''}
                onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="demoLink">Demo Link</Label>
              <Input
                id="demoLink"
                type="url"
                value={formData.demoLink || ''}
                onChange={(e) => setFormData({ ...formData, demoLink: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Project Image</Label>
              <ImageUpload
                value={formData.image}
                onChange={(imageUrl) => setFormData({ ...formData, image: imageUrl })}
              />
            </div>

            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="freeToUse"
                  checked={formData.freeToUse}
                  onCheckedChange={(checked) => setFormData({ ...formData, freeToUse: checked === true })}
                />
                <Label htmlFor="freeToUse">Free to Use</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked === true })}
                />
                <Label htmlFor="featured">Featured</Label>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={loading}
              >
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