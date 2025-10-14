// lib/uploadUtils.ts
'use server'

import { uploadService } from './uploadService'

/**
 * Client-side function to delete uploaded files
 */
export const deleteUploadedFile = async (url: string): Promise<void> => {
  try {
    const response = await fetch('/api/admin/upload/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to delete file')
    }

    console.log('File deleted successfully via API:', url)
  } catch (error) {
    console.error('Error deleting file:', error)
    throw error
  }
}

/**
 * Server-side function to delete uploaded files
 */
export const deleteUploadedFileServer = async (url: string): Promise<void> => {
  try {
    await uploadService.deleteFile(url)
    console.log('File deleted from storage:', url)
  } catch (error) {
    console.error('Error deleting file from storage:', error)
    throw error
  }
}