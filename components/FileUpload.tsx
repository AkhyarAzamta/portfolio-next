// components/FileUpload.tsx
'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, X } from 'lucide-react'

interface FileUploadProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export const FileUpload: React.FC<FileUploadProps> = ({
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
  formData.append('upload_preset', 'raw_uploads')
  formData.append('resource_type', 'raw') // penting untuk zip/rar

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/df1soy4on/raw/upload`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errText = await response.text()
      throw new Error(`Upload failed: ${response.status} ${errText}`)
    }

    const data = await response.json()
    // data.secure_url biasanya mencontohkan URL publik
    onChange(data.secure_url)
  } catch (error) {
    console.error('Upload error:', error)
    alert('Upload gagal — cek console dan konfigurasi Cloudinary')
  } finally {
    setIsUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }
}


  return (
    <div className="space-y-4">
      {value && (
        <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-md">
          <span className="truncate flex-1">{value.split('/').pop()}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onChange('')}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".zip,.rar"
        className="hidden"
        disabled={disabled || isUploading}
      />
      <Button
        type="button"
        variant="outline"
        disabled={disabled || isUploading}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="h-4 w-4 mr-2" />
        {isUploading ? 'Uploading...' : 'Upload Source Code (ZIP/RAR)'}
      </Button>
    </div>
  )
}