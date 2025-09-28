// app/api/upload/file/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid';

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

    // Generate unique filename
    const uniqueName = uuidv4()
    const filename = `${uniqueName}${fileExtension}`

    // Path to store files
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'files')
    const filePath = path.join(uploadDir, filename)

    // Ensure upload directory exists
    await mkdir(uploadDir, { recursive: true })

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Write file to disk
    await writeFile(filePath, buffer)

    // Return the URL path
    const url = `/uploads/files/${filename}`

    return NextResponse.json({ 
      success: true, 
      url,
      filename: file.name, // Keep original filename for display
      size: file.size
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: 'Error uploading file' }, { status: 500 })
  }
}