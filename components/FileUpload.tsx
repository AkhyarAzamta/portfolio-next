// components/FileUpload.tsx
'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, X, File } from 'lucide-react'
import { deleteUploadedFile } from '@/lib/uploadUtils'

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

    try {
      const response = await fetch('/api/admin/upload/file', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const data = await response.json()
      onChange(data.url) // URL path ke file yang diupload
    } catch (error) {
      console.error('Upload error:', error)
      alert(error instanceof Error ? error.message : 'Failed to upload file')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleRemoveFile = async () => {
    if (value && value.startsWith('/uploads/')) {
      try {
        await deleteUploadedFile(value)
        console.log('File deleted successfully:', value)
      } catch (error) {
        console.error('Error deleting file:', error)
        // Tetap lanjutkan menghapus dari state meski gagal hapus file
      }
    }
    onChange('') // Selalu reset value
  }

  // Extract filename from URL untuk display
  const getDisplayFilename = () => {
    if (!value) return ''
    return value.split('/').pop() || 'Download file'
  }

  return (
    <div className="space-y-4">
      {value && (
        <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
          <File className="h-5 w-5 text-gray-500" />
          <span className="truncate flex-1 text-sm font-medium">
            {getDisplayFilename()}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleRemoveFile}
            className="h-8 w-8"
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
        accept=".zip,.rar,.7z"
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
      <p className="text-sm">
        Supported formats: ZIP, RAR, 7Z. Max size: 50MB
      </p>
    </div>
  )
}