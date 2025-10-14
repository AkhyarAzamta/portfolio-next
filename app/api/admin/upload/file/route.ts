// app/api/admin/upload/file/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { uploadService } from '@/lib/uploadService'

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file received' }, { status: 400 })
    }

    // Validasi ekstensi file
    const allowedExtensions = ['.zip', '.rar', '.7z']
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    
    if (!allowedExtensions.includes(fileExtension)) {
      return NextResponse.json({ 
        error: 'Only ZIP, RAR, and 7Z files are allowed' 
      }, { status: 400 })
    }

    // Validasi ukuran file
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: 'File size too large. Max 50MB allowed.' 
      }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload file
    const result = await uploadService.uploadFile(buffer, file.name)

    return NextResponse.json({ 
      success: true, 
      url: result.url,
      filename: result.filename,
      provider: uploadService.getProvider()
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ 
      error: 'Error uploading file' 
    }, { status: 500 })
  }
}