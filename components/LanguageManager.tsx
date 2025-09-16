// app/dashboard/about/components/LanguageSkillsManager.tsx
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pencil, Trash2, Plus, Loader2 } from 'lucide-react'
import { ImageUpload } from '@/components/ImageUpload'
import Image from 'next/image'

interface LanguageSkill {
  id: number;
  name: string;
  level: number;
  category: string | null;
  logo: string | null;
}

export default function LanguageSkillsManager() {
  const [languageSkills, setLanguageSkills] = useState<LanguageSkill[]>([])
  const [loading, setLoading] = useState(true)
  const [editingSkill, setEditingSkill] = useState<LanguageSkill | null>(null)
  const [newSkill, setNewSkill] = useState({ 
    name: '', 
    level: 50, 
    category: '', 
    logo: '' 
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchLanguageSkills()
  }, [])

  const fetchLanguageSkills = async () => {
    try {
      const response = await fetch('/api/language-skills')
      const data = await response.json()
      setLanguageSkills(data)
    } catch (error) {
      console.error('Error fetching language skills:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSkill = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      const response = await fetch('/api/language-skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newSkill,
          category: newSkill.category || null,
          logo: newSkill.logo || null
        }),
      })
      
      if (response.ok) {
        setNewSkill({ name: '', level: 50, category: '', logo: '' })
        fetchLanguageSkills()
      }
    } catch (error) {
      console.error('Error creating language skill:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateSkill = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    if (!editingSkill) return
    
    try {
      const response = await fetch(`/api/language-skills/${editingSkill.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingSkill),
      })
      
      if (response.ok) {
        setEditingSkill(null)
        fetchLanguageSkills()
      }
    } catch (error) {
      console.error('Error updating language skill:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteSkill = async (id: number) => {
    if (!confirm('Are you sure you want to delete this language skill?')) return
    
    try {
      const response = await fetch(`/api/language-skills/${id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        fetchLanguageSkills()
      }
    } catch (error) {
      console.error('Error deleting language skill:', error)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Add New Language Skill Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Add New Language Skill</h2>
        <form onSubmit={handleCreateSkill} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Language Name
              </label>
              <Input
                id="name"
                value={newSkill.name}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                placeholder="e.g., English"
                required
              />
            </div>
            
            <div>
              <label htmlFor="level" className="block text-sm font-medium mb-2">
                Proficiency Level (1-100)
              </label>
              <Input
                id="level"
                type="number"
                min="1"
                max="100"
                value={newSkill.level}
                onChange={(e) => setNewSkill({ ...newSkill, level: parseInt(e.target.value) })}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-2">
                Category
              </label>
              <Select
                value={newSkill.category}
                onValueChange={(value) => setNewSkill({ ...newSkill, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Programming">Programming</SelectItem>
                  <SelectItem value="Spoken">Spoken</SelectItem>
                  <SelectItem value="Written">Written</SelectItem>
                  <SelectItem value="Native">Native</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Logo
              </label>
              <ImageUpload
                value={newSkill.logo}
                onChange={(logo) => setNewSkill({ ...newSkill, logo })}
                disabled={saving}
              />
            </div>
          </div>
          
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Language Skill
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Language Skills List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Language Skills</h2>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Logo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {languageSkills.map((skill) => (
              <TableRow key={skill.id}>
                <TableCell>
                  {skill.logo && (
                    <div className="relative w-8 h-8">
                      <Image
                        src={skill.logo}
                        alt={skill.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{skill.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-primary h-2.5 rounded-full" 
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                    <span className="text-sm">{skill.level}%</span>
                  </div>
                </TableCell>
                <TableCell>{skill.category || 'Uncategorized'}</TableCell>
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

      {/* Edit Language Skill Modal */}
      {editingSkill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Language Skill</h2>
            
            <form onSubmit={handleUpdateSkill}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="edit-name" className="block text-sm font-medium mb-2">
                    Language Name
                  </label>
                  <Input
                    id="edit-name"
                    value={editingSkill.name}
                    onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-level" className="block text-sm font-medium mb-2">
                    Proficiency Level (1-100)
                  </label>
                  <Input
                    id="edit-level"
                    type="number"
                    min="1"
                    max="100"
                    value={editingSkill.level}
                    onChange={(e) => setEditingSkill({ ...editingSkill, level: parseInt(e.target.value) })}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-category" className="block text-sm font-medium mb-2">
                    Category
                  </label>
                  <Select
                    value={editingSkill.category || ''}
                    onValueChange={(value) => setEditingSkill({ ...editingSkill, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Programming">Programming</SelectItem>
                      <SelectItem value="Spoken">Spoken</SelectItem>
                      <SelectItem value="Written">Written</SelectItem>
                      <SelectItem value="Native">Native</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Logo
                  </label>
                  <ImageUpload
                    value={editingSkill.logo || ''}
                    onChange={(logo) => setEditingSkill({ ...editingSkill, logo })}
                    disabled={saving}
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
                  <Button type="submit" disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
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