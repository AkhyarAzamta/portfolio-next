// app/api/test-upload/route.ts
import { NextResponse } from 'next/server'
import { uploadService } from '@/lib/uploadService'

export async function GET() {
  const provider = uploadService.getProvider()
  
  return NextResponse.json({
    provider,
    message: provider === 'cloudinary' 
      ? 'Cloudinary is configured and ready' 
      : 'Using local storage (Cloudinary not configured)',
    timestamp: new Date().toISOString()
  })
}