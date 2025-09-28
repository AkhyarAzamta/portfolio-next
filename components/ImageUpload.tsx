// components/ImageUpload.tsx
'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ImagePlus, X } from 'lucide-react'
import Image from 'next/image'
import { deleteUploadedFile } from '@/lib/uploadUtils'

export interface ImageUploadProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  onError?: (error: string) => void
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  disabled
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/admin/upload/image', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const data = await response.json()
      onChange(data.url) // URL path ke gambar yang diupload
    } catch (error) {
      console.error('Upload error:', error)
      alert(error instanceof Error ? error.message : 'Failed to upload image')
    } finally {
      setIsUploading(false)
      // Reset input file
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveImage = async () => {
    if (value && value.startsWith('/uploads/')) {
      try {
        await deleteUploadedFile(value)
        console.log('Image deleted successfully:', value)
      } catch (error) {
        console.error('Error deleting image:', error)
        // Tetap lanjutkan menghapus dari state meski gagal hapus file
      }
    }
    onChange('') // Selalu reset value meski file tidak terhapus
  }

  return (
    <div className="space-y-4">
      {value && (
        <div className="relative aspect-video max-w-xs">
          <Image
            fill
            className="object-cover rounded-md"
            src={value}
            alt="Uploaded image"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-image.jpg'
            }}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={handleRemoveImage}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={disabled || isUploading}
      />
      <Button
        type="button"
        variant="outline"
        disabled={disabled || isUploading}
        onClick={() => fileInputRef.current?.click()}
      >
        <ImagePlus className="h-4 w-4 mr-2" />
        {isUploading ? 'Uploading...' : 'Upload an Image'}
      </Button>
      <p className="text-sm">
        Supported formats: JPEG, PNG, GIF, WEBP. Max size: 5MB
      </p>
    </div>
  )
}