// app/api/admin/upload/image/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { uploadService } from '@/lib/uploadService'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file received' }, { status: 400 })
    }

    // Validasi tipe file
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    // Validasi ukuran file
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: 'File size too large. Max 5MB allowed.' 
      }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload file
    const result = await uploadService.uploadImage(buffer, file.name)

    return NextResponse.json({ 
      success: true, 
      url: result.url,
      filename: result.filename,
      provider: uploadService.getProvider()
    })
  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json({ 
      error: 'Error uploading image' 
    }, { status: 500 })
  }
}