// app/dashboard/about/components/SkillsManager.tsx
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pencil, Trash2, Plus, Loader2 } from 'lucide-react'
import { ImageUpload } from '@/components/ImageUpload'
import Image from 'next/image'
import { SkillCategory, Skill } from '@/types'

export default function SkillsManager() {
  const [categories, setCategories] = useState<SkillCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [newSkill, setNewSkill] = useState({ 
    name: '', 
    logo: '', 
    categoryId: '' 
  })
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      const response = await fetch('/api/skills')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching skills:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSkill = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)
    
    try {
      const response = await fetch('/api/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newSkill,
          categoryId: parseInt(newSkill.categoryId)
        }),
      })
      
      if (response.ok) {
        setNewSkill({ name: '', logo: '', categoryId: '' })
        fetchSkills() // Refresh the list
      }
    } catch (error) {
      console.error('Error creating skill:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleUpdateSkill = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)
    
    if (!editingSkill) return
    
    try {
      const response = await fetch(`/api/skills/${editingSkill.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingSkill),
      })
      
      if (response.ok) {
        setEditingSkill(null)
        fetchSkills() // Refresh the list
      }
    } catch (error) {
      console.error('Error updating skill:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteSkill = async (id: number) => {
    if (!confirm('Are you sure you want to delete this skill?')) return
    
    try {
      const response = await fetch(`/api/skills/${id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        fetchSkills() // Refresh the list
      }
    } catch (error) {
      console.error('Error deleting skill:', error)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Add New Skill Form */}
      <div className="bg-card p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Add New Skill</h2>
        <form onSubmit={handleCreateSkill} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Skill Name
              </label>
              <Input
                id="name"
                value={newSkill.name}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                placeholder="e.g., React"
                required
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-2">
                Category
              </label>
              <Select
                value={newSkill.categoryId}
                onValueChange={(value) => setNewSkill({ ...newSkill, categoryId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Logo
            </label>
            <ImageUpload
              value={newSkill.logo}
              onChange={(logo) => setNewSkill({ ...newSkill, logo })}
              disabled={uploading}
            />
          </div>
          
          <div>
            <Button type="submit" disabled={uploading}>
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Skill
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Skills List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Skills</h2>
        
        {categories.map((category) => (
          <div key={category.id} className="mb-6">
            <h3 className="text-lg font-medium mb-3">{category.name}</h3>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Logo</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {category.skills!.map((skill) => (
                  <TableRow key={skill.id}>
                    <TableCell className="font-medium">{skill.name}</TableCell>
                    <TableCell>
                      {skill.logo && (
                        <Image 
                          src={skill.logo} 
                          alt={skill.name} 
                          width={32} 
                          height={32} 
                          className="w-8 h-8 object-contain"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingSkill(skill)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteSkill(skill.id)}
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
        ))}
      </div>

      {/* Edit Skill Modal */}
      {editingSkill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Skill</h2>
            
            <form onSubmit={handleUpdateSkill}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="edit-name" className="block text-sm font-medium mb-2">
                    Skill Name
                  </label>
                  <Input
                    id="edit-name"
                    value={editingSkill.name}
                    onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-category" className="block text-sm font-medium mb-2">
                    Category
                  </label>
                  <Select
                    value={editingSkill.categoryId.toString()}
                    onValueChange={(value) => setEditingSkill({ 
                      ...editingSkill, 
                      categoryId: parseInt(value) 
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Logo
                  </label>
                  <ImageUpload
                    value={editingSkill.logo}
                    onChange={(logo) => setEditingSkill({ ...editingSkill, logo })}
                    disabled={uploading}
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingSkill(null)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={uploading}>
                    {uploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}