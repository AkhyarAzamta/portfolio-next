// components/ImageUpload.tsx
'use client'

import { useState } from 'react'
import { CldUploadWidget } from 'next-cloudinary'
import { Button } from '@/components/ui/button'
import { ImagePlus, X } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  disabled
}) => {
  const [isUploading, setIsUploading] = useState(false)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onUpload = (result: any) => {
    if (result.event === 'success') {
      onChange(result.info.secure_url)
    }
    setIsUploading(false)
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
            onError={(e) => {
              e.currentTarget.src = '/placeholder-image.jpg'
            }}
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => onChange('')}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      <CldUploadWidget
        onUploadAdded={() => setIsUploading(true)}
        onSuccess={onUpload}
        onError={() => {
          setIsUploading(false)
          console.error('Upload failed')
        }}
        options={{
          maxFiles: 1,
          sources: ['local'],
          multiple: false,
          uploadPreset: 'portfolio_uploads',
        }}
      >
        {({ open }) => {
          return (
            <Button
              type="button"
              variant="outline"
              disabled={disabled || isUploading}
              onClick={() => open()}
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              {isUploading ? 'Uploading...' : 'Upload an Image'}
            </Button>
          )
        }}
      </CldUploadWidget>
    </div>
  )
}