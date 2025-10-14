// lib/uploadProvider.ts
export type UploadProvider = 'local' | 'cloudinary'

export interface UploadResult {
  url: string
  filename: string
  size?: number
  publicId?: string
}

export interface UploadConfig {
  provider: UploadProvider
  cloudinary?: {
    cloudName: string
    apiKey: string
    apiSecret: string
  }
}

// Simple detection - hanya cek CLOUDINARY_URL
export function getUploadConfig(): UploadConfig {
  const cloudinaryUrl = process.env.CLOUDINARY_URL

  console.log('🔍 Checking CLOUDINARY_URL:', cloudinaryUrl ? '✅ Found' : '❌ Not found')

  if (cloudinaryUrl) {
    // Extract dari CLOUDINARY_URL format: cloudinary://api_key:api_secret@cloud_name
    const match = cloudinaryUrl.match(/cloudinary:\/\/([^:]+):([^@]+)@([^\/]+)/)
    
    if (match) {
      const [, apiKey, apiSecret, cloudName] = match
      console.log('✅ Cloudinary config extracted successfully')
      
      return {
        provider: 'cloudinary',
        cloudinary: { cloudName, apiKey, apiSecret }
      }
    } else {
      console.log('❌ Invalid CLOUDINARY_URL format')
    }
  }

  console.log('📁 Using local storage')
  return { provider: 'local' }
}