// app/dashboard/about/components/EducationManager.tsx
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { Loading } from './ui/loading'
import { Education } from '@/types'

export default function EducationManager() {
  const [educations, setEducations] = useState<Education[]>([])
  const [loading, setLoading] = useState(true)
  const [editingEducation, setEditingEducation] = useState<Education | null>(null)
  const [newEducation, setNewEducation] = useState({
    degree: '',
    institution: '',
    period: '',
    description: ''
  })

  useEffect(() => {
    fetchEducations()
  }, [])

  const fetchEducations = async () => {
    try {
      const response = await fetch('/api/education')
      const data = await response.json()
      setEducations(data)
    } catch (error) {
      console.error('Error fetching educations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateEducation = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/admin/education', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEducation),
      })

      if (response.ok) {
        setNewEducation({ degree: '', institution: '', period: '', description: '' })
        fetchEducations()
      }
    } catch (error) {
      console.error('Error creating education:', error)
    }
  }

  const handleUpdateEducation = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!editingEducation) return

    try {
      const response = await fetch(`/api/admin/education/${editingEducation.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingEducation),
      })

      if (response.ok) {
        setEditingEducation(null)
        fetchEducations()
      }
    } catch (error) {
      console.error('Error updating education:', error)
    }
  }

  const handleDeleteEducation = async (id: number) => {
    if (!confirm('Are you sure you want to delete this education?')) return

    try {
      const response = await fetch(`/api/admin/education/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchEducations()
      }
    } catch (error) {
      console.error('Error deleting education:', error)
    }
  }

  if (loading) return <Loading />

  return (
    <div className="space-y-6">
      {/* Add New Education Form */}
      <div className="bg-card p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Add New Education</h2>
        <form onSubmit={handleCreateEducation} className="space-y-4">
          <div>
            <label htmlFor="degree" className="block text-sm font-medium mb-2">
              Degree
            </label>
            <Input
              id="degree"
              value={newEducation.degree}
              onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
              placeholder="e.g., Bachelor of Science in Computer Science"
              required
            />
          </div>

          <div>
            <label htmlFor="institution" className="block text-sm font-medium mb-2">
              Institution
            </label>
            <Input
              id="institution"
              value={newEducation.institution}
              onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
              placeholder="e.g., University Name"
              required
            />
          </div>

          <div>
            <label htmlFor="period" className="block text-sm font-medium mb-2">
              Period
            </label>
            <Input
              id="period"
              value={newEducation.period}
              onChange={(e) => setNewEducation({ ...newEducation, period: e.target.value })}
              placeholder="e.g., 2014 - 2018"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description
            </label>
            <Textarea
              id="description"
              value={newEducation.description}
              onChange={(e) => setNewEducation({ ...newEducation, description: e.target.value })}
              placeholder="Enter description"
              rows={3}
            />
          </div>

          <Button type="submit">
            <Plus className="mr-2 h-4 w-4" />
            Add Education
          </Button>
        </form>
      </div>

      {/* Educations List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Education</h2>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Degree</TableHead>
              <TableHead>Institution</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {educations.map((education) => (
              <TableRow key={education.id}>
                <TableCell className="font-medium">{education.degree}</TableCell>
                <TableCell>{education.institution}</TableCell>
                <TableCell>{education.period}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingEducation(education)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteEducation(education.id)}
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

      {/* Edit Education Modal */}
      {editingEducation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Education</h2>

            <form onSubmit={handleUpdateEducation}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="edit-degree" className="block text-sm font-medium mb-2">
                    Degree
                  </label>
                  <Input
                    id="edit-degree"
                    value={editingEducation.degree}
                    onChange={(e) => setEditingEducation({ ...editingEducation, degree: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="edit-institution" className="block text-sm font-medium mb-2">
                    Institution
                  </label>
                  <Input
                    id="edit-institution"
                    value={editingEducation.institution}
                    onChange={(e) => setEditingEducation({ ...editingEducation, institution: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="edit-period" className="block text-sm font-medium mb-2">
                    Period
                  </label>
                  <Input
                    id="edit-period"
                    value={editingEducation.period}
                    onChange={(e) => setEditingEducation({ ...editingEducation, period: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="edit-description" className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <Textarea
                    id="edit-description"
                    value={editingEducation.description || ''}
                    onChange={(e) => setEditingEducation({
                      ...editingEducation,
                      description: e.target.value
                    })}
                    rows={3}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingEducation(null)}
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