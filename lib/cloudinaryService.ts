// lib/services/cloudinaryService.ts
import { v2 as cloudinary } from 'cloudinary'
import { UploadResult } from './uploadProvider'

export class CloudinaryService {
  constructor(
    private cloudName: string,
    private apiKey: string,
    private apiSecret: string
  ) {
    cloudinary.config({
      cloud_name: this.cloudName,
      api_key: this.apiKey,
      api_secret: this.apiSecret,
      secure: true
    })
    console.log('☁️ Cloudinary configured for cloud:', this.cloudName)
  }

  async uploadImage(file: Buffer, originalFilename: string): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      // Convert to base64 for simple upload
      const base64Image = `data:image/jpeg;base64,${file.toString('base64')}`
      
      cloudinary.uploader.upload(base64Image, {
        folder: 'portfolio/images',
        public_id: this.generatePublicId(originalFilename),
        resource_type: 'image'
      }, (error, result) => {
        if (error) {
          reject(new Error(`Cloudinary upload failed: ${error.message}`))
        } else if (result) {
          resolve({
            url: result.secure_url,
            filename: originalFilename,
            size: result.bytes,
            publicId: result.public_id
          })
        } else {
          reject(new Error('Cloudinary upload failed: No result'))
        }
      })
    })
  }

  async uploadFile(file: Buffer, originalFilename: string): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      const base64File = `data:application/zip;base64,${file.toString('base64')}`
      
      cloudinary.uploader.upload(base64File, {
        folder: 'portfolio/files',
        public_id: this.generatePublicId(originalFilename),
        resource_type: 'raw'
      }, (error, result) => {
        if (error) {
          reject(new Error(`Cloudinary file upload failed: ${error.message}`))
        } else if (result) {
          resolve({
            url: result.secure_url,
            filename: originalFilename,
            size: result.bytes,
            publicId: result.public_id
          })
        } else {
          reject(new Error('Cloudinary file upload failed: No result'))
        }
      })
    })
  }

  async deleteByUrl(url: string): Promise<void> {
    const publicId = this.extractPublicIdFromUrl(url)
    if (!publicId) {
      throw new Error('Could not extract public ID from URL')
    }

    const resourceType = url.includes('/image/upload/') ? 'image' : 'raw'
    
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    })
  }

  private generatePublicId(filename: string): string {
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, "")
    const timestamp = Date.now()
    return `${nameWithoutExt}_${timestamp}`
  }

  private extractPublicIdFromUrl(url: string): string | null {
    try {
      const urlObj = new URL(url)
      const pathname = urlObj.pathname
      
      // Extract public ID from path like: /image/upload/v1234567/public_id.jpg
      const uploadIndex = pathname.indexOf('/upload/')
      if (uploadIndex === -1) return null
      
      let publicIdPart = pathname.substring(uploadIndex + 8) // +8 untuk skip '/upload/'
      
      // Remove version if exists (v1234567/)
      if (publicIdPart.startsWith('v')) {
        const nextSlash = publicIdPart.indexOf('/')
        if (nextSlash !== -1) {
          publicIdPart = publicIdPart.substring(nextSlash + 1)
        }
      }
      
      // Remove file extension
      return publicIdPart.replace(/\.[^/.]+$/, "")
    } catch {
      return null
    }
  }
}