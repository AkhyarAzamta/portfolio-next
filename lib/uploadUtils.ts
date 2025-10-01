'use server'
// lib/uploadUtils.ts
/**
 * Client-side function to delete uploaded files
 */
export const deleteUploadedFile = async (url: string): Promise<void> => {
  try {
    // Only delete files from our uploads directory
    if (!url.startsWith('/uploads/')) {
      console.log('Skipping deletion - not an uploaded file:', url)
      return
    }

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
    throw error // Re-throw agar caller tahu ada error
  }
}

/**
 * Server-side function to delete uploaded files
 */
export const deleteUploadedFileServer = async (url: string): Promise<void> => {
  try {
    if (!url.startsWith('/uploads/')) {
      console.log('Skipping deletion - not an uploaded file:', url)
      return
    }

    const { unlink } = await import('fs/promises')
    const path = await import('path')

    // Extract filename from URL
    const filename = url.split('/').pop()
    if (!filename) {
      console.error('Invalid URL:', url)
      return
    }

    // Determine file type from URL path
    let filePath: string
    if (url.includes('/uploads/images/')) {
      filePath = path.join(process.cwd(), 'public', 'uploads', 'images', filename)
    } else if (url.includes('/uploads/files/')) {
      filePath = path.join(process.cwd(), 'public', 'uploads', 'files', filename)
    } else {
      console.error('Invalid file path:', url)
      return
    }

    // Delete file
    await unlink(filePath)
    console.log('File deleted from server:', filePath)
  } catch (error) {
    // File mungkin sudah tidak ada, ini normal
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.log('File already deleted from server:', url)
    } else {
      console.error('Error deleting file from server:', error)
      throw error
    }
  }
}