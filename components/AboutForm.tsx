// components/AboutForm.tsx
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Save } from 'lucide-react'
import { Loading } from './ui/loading'
import { toast } from 'sonner'

interface AboutData {
  id: number;
  bio: string;
}

export default function AboutForm() {
  const [about, setAbout] = useState<AboutData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchAbout()
  }, [])

  const fetchAbout = async () => {
    try {
      const response = await fetch('/api/about')
      const data = await response.json()
      setAbout(data)
    } catch (error) {
      console.error('Error fetching about data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch('/api/admin/about', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bio: about?.bio || '' }),
      })

      if (response.ok) {
        // Show success message
        toast.success('About data saved successfully!')
        console.log('About data saved successfully')
      }
    } catch (error) {
      toast.error('Error saving about data')
      console.error('Error saving about data:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loading />

  return (
    <div className="bg-card p-6 rounded-lg shadow-md">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="bio" className="block text-sm font-medium mb-2">
            Bio
          </label>
          <Textarea
            id="bio"
            value={about?.bio || ''}
            onChange={(e) => setAbout({ ...about, bio: e.target.value } as AboutData)}
            rows={6}
            placeholder="Enter your bio here..."
          />
        </div>

        <Button type="submit" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </form>
    </div>
  )
}