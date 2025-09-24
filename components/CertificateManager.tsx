// app/dashboard/about/components/CertificateManager.tsx
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pencil, Trash2, Plus, Loader2, ExternalLink, Eye, X } from 'lucide-react'
import { ImageUpload } from '@/components/ImageUpload'
import Image from 'next/image'
import { Certificate } from '@/types'
import { Loading } from './ui/loading'

export default function CertificateManager() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null)
  const [newCertificate, setNewCertificate] = useState({ 
    name: '', 
    issuer: '', 
    issueDate: '', 
    expiryDate: '', 
    credentialURL: '',
    image: '' 
  })
  const [saving, setSaving] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    fetchCertificates()
  }, [])

  const fetchCertificates = async () => {
    try {
      const response = await fetch('/api/certificates')
      const data = await response.json()
      setCertificates(data)
    } catch (error) {
      console.error('Error fetching certificates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCertificate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      const response = await fetch('/api/admin/certificates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newCertificate,
          expiryDate: newCertificate.expiryDate || null,
          credentialURL: newCertificate.credentialURL || null,
          image: newCertificate.image || null
        }),
      })
      
      if (response.ok) {
        setNewCertificate({ 
          name: '', 
          issuer: '', 
          issueDate: '', 
          expiryDate: '', 
          credentialURL: '',
          image: '' 
        })
        fetchCertificates()
      }
    } catch (error) {
      console.error('Error creating certificate:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateCertificate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    if (!editingCertificate) return
    
    try {
      const response = await fetch(`/api/admin/certificates/${editingCertificate.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editingCertificate,
          expiryDate: editingCertificate.expiryDate || null,
          credentialURL: editingCertificate.credentialURL || null,
          image: editingCertificate.image || null
        }),
      })
      
      if (response.ok) {
        setEditingCertificate(null)
        setImagePreview(null)
        fetchCertificates()
      }
    } catch (error) {
      console.error('Error updating certificate:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteCertificate = async (id: number) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return
    
    try {
      const response = await fetch(`/api/admin/certificates/${id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        fetchCertificates()
      }
    } catch (error) {
      console.error('Error deleting certificate:', error)
    }
  }

  const openImagePreview = (imageUrl: string) => {
    setImagePreview(imageUrl)
  }

  if (loading) return <Loading />

  return (
    <div className="space-y-6">
      {/* Add New Certificate Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Add New Certificate</h2>
        <form onSubmit={handleCreateCertificate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Certificate Name
              </label>
              <Input
                id="name"
                value={newCertificate.name}
                onChange={(e) => setNewCertificate({ ...newCertificate, name: e.target.value })}
                placeholder="e.g., AWS Certified Solutions Architect"
                required
              />
            </div>
            
            <div>
              <label htmlFor="issuer" className="block text-sm font-medium mb-2">
                Issuing Organization
              </label>
              <Input
                id="issuer"
                value={newCertificate.issuer}
                onChange={(e) => setNewCertificate({ ...newCertificate, issuer: e.target.value })}
                placeholder="e.g., Amazon Web Services"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="issueDate" className="block text-sm font-medium mb-2">
                Issue Date (Month Year)
              </label>
              <Input
                id="issueDate"
                value={newCertificate.issueDate}
                onChange={(e) => setNewCertificate({ ...newCertificate, issueDate: e.target.value })}
                placeholder="e.g., January 2023"
                required
              />
            </div>
            
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium mb-2">
                Expiration Date (Month Year) - Optional
              </label>
              <Input
                id="expiryDate"
                value={newCertificate.expiryDate}
                onChange={(e) => setNewCertificate({ ...newCertificate, expiryDate: e.target.value })}
                placeholder="e.g., January 2025"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="credentialURL" className="block text-sm font-medium mb-2">
              Credential URL - Optional
            </label>
            <Input
              id="credentialURL"
              value={newCertificate.credentialURL}
              onChange={(e) => setNewCertificate({ ...newCertificate, credentialURL: e.target.value })}
              placeholder="e.g., https://www.credly.com/users/johndoe/badges/123456"
              type="url"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Certificate Image
            </label>
            <ImageUpload
              value={newCertificate.image}
              onChange={(image) => setNewCertificate({ ...newCertificate, image })}
              disabled={saving}
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
                <Plus className="mr-2 h-4 w-4" />
                Add Certificate
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Certificates List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Certificates</h2>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Issuer</TableHead>
              <TableHead>Issue Date</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {certificates.map((certificate) => (
              <TableRow key={certificate.id}>
                <TableCell>
                  {certificate.image && (
                    <div className="relative w-12 h-12">
                      <Image
                        src={certificate.image}
                        alt={certificate.name}
                        fill
                        sizes='48px'
                        className="object-cover rounded"
                        onClick={() => openImagePreview(certificate.image!)}
                      />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{certificate.name}</TableCell>
                <TableCell>{certificate.issuer}</TableCell>
                <TableCell>{certificate.issueDate}</TableCell>
                <TableCell>{certificate.expiryDate || 'No expiry'}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {certificate.image && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openImagePreview(certificate.image!)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    {certificate.credentialURL && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <a href={certificate.credentialURL} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingCertificate(certificate)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteCertificate(certificate.id)}
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

      {/* Edit Certificate Modal */}
      {editingCertificate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Certificate</h2>
            
            <form onSubmit={handleUpdateCertificate}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="edit-name" className="block text-sm font-medium mb-2">
                    Certificate Name
                  </label>
                  <Input
                    id="edit-name"
                    value={editingCertificate.name}
                    onChange={(e) => setEditingCertificate({ ...editingCertificate, name: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-issuer" className="block text-sm font-medium mb-2">
                    Issuing Organization
                  </label>
                  <Input
                    id="edit-issuer"
                    value={editingCertificate.issuer}
                    onChange={(e) => setEditingCertificate({ ...editingCertificate, issuer: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-issueDate" className="block text-sm font-medium mb-2">
                    Issue Date (Month Year)
                  </label>
                  <Input
                    id="edit-issueDate"
                    value={editingCertificate.issueDate}
                    onChange={(e) => setEditingCertificate({ ...editingCertificate, issueDate: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-expiryDate" className="block text-sm font-medium mb-2">
                    Expiration Date (Month Year) - Optional
                  </label>
                  <Input
                    id="edit-expiryDate"
                    value={editingCertificate.expiryDate || ''}
                    onChange={(e) => setEditingCertificate({ ...editingCertificate, expiryDate: e.target.value })}
                    placeholder="e.g., January 2025"
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-credentialURL" className="block text-sm font-medium mb-2">
                    Credential URL - Optional
                  </label>
                  <Input
                    id="edit-credentialURL"
                    value={editingCertificate.credentialURL || ''}
                    onChange={(e) => setEditingCertificate({ ...editingCertificate, credentialURL: e.target.value })}
                    type="url"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Certificate Image
                  </label>
                  <ImageUpload
                    value={editingCertificate.image || ''}
                    onChange={(image) => setEditingCertificate({ ...editingCertificate, image })}
                    disabled={saving}
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingCertificate(null)
                      setImagePreview(null)
                    }}
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

      {/* Image Preview Modal */}
      {imagePreview && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50" onClick={() => setImagePreview(null)}>
          <div className="relative max-w-4xl max-h-full">
            <button 
              className="absolute top-4 right-4 bg-white rounded-full p-2 z-10"
              onClick={() => setImagePreview(null)}
            >
              <X className="h-6 w-6" />
            </button>
            <Image
              src={imagePreview}
              alt="Certificate preview"
              width={800}
              height={600}
              className="object-contain max-h-screen"
            />
          </div>
        </div>
      )}
    </div>
  )
}