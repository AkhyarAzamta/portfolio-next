// scripts/test-cloudinary.ts
import { getUploadConfig } from '@/lib/uploadProvider'
import { CloudinaryService } from '@/lib/cloudinaryService'

async function testCloudinary() {
  console.log('🧪 Testing Cloudinary Configuration...\n')

  const config = getUploadConfig()
  console.log('📋 Config Result:', config)

  if (config.provider === 'cloudinary' && config.cloudinary) {
    console.log('✅ Cloudinary config found')
    
    try {
      const cloudinary = new CloudinaryService(
        config.cloudinary.cloudName,
        config.cloudinary.apiKey,
        config.cloudinary.apiSecret
      )
      
      console.log('✅ Cloudinary service created successfully')
      
      // Test connection dengan upload kecil
      const testBuffer = Buffer.from('test')
      console.log('🔄 Testing upload...')
      
      const result = await cloudinary.uploadImage(testBuffer, 'test.jpg')
      console.log('✅ Upload test successful:', result.url)
      
      // Cleanup
      if (result.publicId) {
        await cloudinary.deleteByUrl(result.publicId)
        console.log('✅ Test file cleaned up')
      }
      
    } catch (error) {
      console.error('❌ Cloudinary test failed:', error)
    }
  } else {
    console.log('❌ Cloudinary config not found or incomplete')
    console.log('💡 Make sure you have either:')
    console.log('   - CLOUDINARY_URL environment variable')
    console.log('   - OR CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET')
  }
}

testCloudinary()