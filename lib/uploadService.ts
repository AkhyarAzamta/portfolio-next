// lib/uploadService.ts
import { getUploadConfig, UploadResult } from './uploadProvider'
import { CloudinaryService } from './cloudinaryService'
import { LocalFileService } from './localFileService'

export class UploadService {
  private config = getUploadConfig()
  private cloudinaryService: CloudinaryService | null = null
  private localFileService = new LocalFileService()

  constructor() {
    console.log('🚀 Upload Service Initialized with provider:', this.config.provider)

    if (this.config.provider === 'cloudinary' && this.config.cloudinary) {
      this.cloudinaryService = new CloudinaryService(
        this.config.cloudinary.cloudName,
        this.config.cloudinary.apiKey,
        this.config.cloudinary.apiSecret
      )
      console.log('✅ Cloudinary service ready')
    }
  }

  async uploadImage(file: Buffer, originalFilename: string): Promise<UploadResult> {
    // FORCE: Always try Cloudinary first if configured
    if (this.cloudinaryService) {
      try {
        console.log('☁️ Uploading to Cloudinary...')
        const result = await this.cloudinaryService.uploadImage(file, originalFilename)
        console.log('✅ Cloudinary upload successful:', result.url)
        return result
      } catch (error) {
        console.error('❌ Cloudinary upload failed:', error)
        throw error // Don't fallback, just throw error
      }
    }

    // Fallback to local only if Cloudinary not configured
    console.log('📁 Uploading to local storage...')
    const result = await this.localFileService.uploadImage(file, originalFilename)
    console.log('✅ Local upload successful:', result.url)
    return result
  }

  async uploadFile(file: Buffer, originalFilename: string): Promise<UploadResult> {
    // FORCE: Always try Cloudinary first if configured
    if (this.cloudinaryService) {
      try {
        console.log('☁️ Uploading file to Cloudinary...')
        const result = await this.cloudinaryService.uploadFile(file, originalFilename)
        console.log('✅ Cloudinary file upload successful:', result.url)
        return result
      } catch (error) {
        console.error('❌ Cloudinary file upload failed:', error)
        throw error
      }
    }

    // Fallback to local
    console.log('📁 Uploading file to local storage...')
    const result = await this.localFileService.uploadFile(file, originalFilename)
    console.log('✅ Local file upload successful:', result.url)
    return result
  }

  async deleteFile(url: string): Promise<void> {
    if (this.cloudinaryService && this.isCloudinaryUrl(url)) {
      await this.cloudinaryService.deleteByUrl(url)
    } else {
      await this.localFileService.deleteFile(url)
    }
  }

  getProvider(): string {
    return this.config.provider
  }

  private isCloudinaryUrl(url: string): boolean {
    return url.includes('cloudinary.com') || url.includes('res.cloudinary.com')
  }
}

export const uploadService = new UploadService()