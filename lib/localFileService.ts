// lib/services/localFileService.ts
import { writeFile, unlink, mkdir } from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { UploadResult } from './uploadProvider'

export class LocalFileService {
  private baseDir = path.join(process.cwd(), 'public', 'projects')

  async uploadImage(file: Buffer, originalFilename: string): Promise<UploadResult> {
    const uniqueName = uuidv4()
    const fileExtension = originalFilename.split('.').pop()
    const filename = `${uniqueName}.${fileExtension}`

    const uploadDir = path.join(this.baseDir, 'images')
    const filePath = path.join(uploadDir, filename)

    await mkdir(uploadDir, { recursive: true })
    await writeFile(filePath, file)

    const url = `/projects/images/${filename}`

    return {
      url,
      filename: originalFilename,
      size: file.length
    }
  }

  async uploadFile(file: Buffer, originalFilename: string): Promise<UploadResult> {
    const uniqueName = uuidv4()
    const fileExtension = originalFilename.split('.').pop()
    const filename = `${uniqueName}.${fileExtension}`

    const uploadDir = path.join(this.baseDir, 'files')
    const filePath = path.join(uploadDir, filename)

    await mkdir(uploadDir, { recursive: true })
    await writeFile(filePath, file)

    const url = `/projects/files/${filename}`

    return {
      url,
      filename: originalFilename,
      size: file.length
    }
  }

  async deleteFile(url: string): Promise<void> {
    if (!url.startsWith('/projects/')) {
      console.log('Skipping deletion - not a local file:', url)
      return
    }

    const filename = url.split('/').pop()
    if (!filename) {
      console.error('Invalid URL:', url)
      return
    }

    let filePath: string
    if (url.includes('/projects/images/')) {
      filePath = path.join(this.baseDir, 'images', filename)
    } else if (url.includes('/projects/files/')) {
      filePath = path.join(this.baseDir, 'files', filename)
    } else {
      console.error('Invalid file path:', url)
      return
    }

    try {
      await unlink(filePath)
      console.log('Local file deleted:', filePath)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        console.log('File already deleted:', filePath)
      } else {
        throw error
      }
    }
  }
}