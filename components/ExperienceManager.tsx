// app/dashboard/about/components/ExperienceManager.tsx
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { Loading } from './ui/loading'

interface Experience {
  id: number;
  title: string;
  company: string;
  period: string;
  description: string[];
}

export default function ExperienceManager() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null)
  const [newExperience, setNewExperience] = useState({
    title: '',
    company: '',
    period: '',
    description: ''
  })

  useEffect(() => {
    fetchExperiences()
  }, [])

  const fetchExperiences = async () => {
    try {
      const response = await fetch('/api/experience')
      const data = await response.json()
      setExperiences(data)
    } catch (error) {
      console.error('Error fetching experiences:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateExperience = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/admin/experience', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newExperience,
          description: newExperience.description.split('\n').filter(item => item.trim() !== '')
        }),
      })

      if (response.ok) {
        setNewExperience({ title: '', company: '', period: '', description: '' })
        fetchExperiences()
      }
    } catch (error) {
      console.error('Error creating experience:', error)
    }
  }

  const handleUpdateExperience = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!editingExperience) return

    try {
      const response = await fetch(`/api/admin/experience/${editingExperience.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editingExperience,
          description: Array.isArray(editingExperience.description)
            ? editingExperience.description
            : [editingExperience.description]
        }),
      })

      if (response.ok) {
        setEditingExperience(null)
        fetchExperiences()
      }
    } catch (error) {
      console.error('Error updating experience:', error)
    }
  }

  const handleDeleteExperience = async (id: number) => {
    if (!confirm('Are you sure you want to delete this experience?')) return

    try {
      const response = await fetch(`/api/admin/experience/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchExperiences()
      }
    } catch (error) {
      console.error('Error deleting experience:', error)
    }
  }

  if (loading) return <Loading />

  return (
    <div className="space-y-6">
      {/* Add New Experience Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Add New Experience</h2>
        <form onSubmit={handleCreateExperience} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Title
              </label>
              <Input
                id="title"
                value={newExperience.title}
                onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
                placeholder="e.g., Senior Full Stack Developer"
                required
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium mb-2">
                Company
              </label>
              <Input
                id="company"
                value={newExperience.company}
                onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                placeholder="e.g., Company Name"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="period" className="block text-sm font-medium mb-2">
              Period
            </label>
            <Input
              id="period"
              value={newExperience.period}
              onChange={(e) => setNewExperience({ ...newExperience, period: e.target.value })}
              placeholder="e.g., 2020 - Present"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description (one item per line)
            </label>
            <Textarea
              id="description"
              value={newExperience.description}
              onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
              placeholder="Enter each description item on a new line"
              rows={4}
              required
            />
          </div>

          <Button type="submit">
            <Plus className="mr-2 h-4 w-4" />
            Add Experience
          </Button>
        </form>
      </div>

      {/* Experiences List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Experiences</h2>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {experiences.map((experience) => (
              <TableRow key={experience.id}>
                <TableCell className="font-medium">{experience.title}</TableCell>
                <TableCell>{experience.company}</TableCell>
                <TableCell>{experience.period}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingExperience(experience)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteExperience(experience.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Experience Modal */}
      {editingExperience && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Experience</h2>

            <form onSubmit={handleUpdateExperience}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="edit-title" className="block text-sm font-medium mb-2">
                    Title
                  </label>
                  <Input
                    id="edit-title"
                    value={editingExperience.title}
                    onChange={(e) => setEditingExperience({ ...editingExperience, title: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="edit-company" className="block text-sm font-medium mb-2">
                    Company
                  </label>
                  <Input
                    id="edit-company"
                    value={editingExperience.company}
                    onChange={(e) => setEditingExperience({ ...editingExperience, company: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="edit-period" className="block text-sm font-medium mb-2">
                    Period
                  </label>
                  <Input
                    id="edit-period"
                    value={editingExperience.period}
                    onChange={(e) => setEditingExperience({ ...editingExperience, period: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="edit-description" className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <Textarea
                    id="edit-description"
                    value={Array.isArray(editingExperience.description)
                      ? editingExperience.description.join('\n')
                      : editingExperience.description}
                    onChange={(e) => setEditingExperience({
                      ...editingExperience,
                      description: e.target.value.split('\n').filter(item => item.trim() !== '')
                    })}
                    rows={4}
                    required
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingExperience(null)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}