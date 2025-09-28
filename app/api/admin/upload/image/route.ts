// app/api/upload/image/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

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

    // Generate unique filename
    const uniqueName = uuidv4()
    const fileExtension = file.name.split('.').pop()
    const filename = `${uniqueName}.${fileExtension}`

    // Path to store images
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'images')
    const filePath = path.join(uploadDir, filename)

    // Ensure upload directory exists
    await mkdir(uploadDir, { recursive: true })

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Write file to disk
    await writeFile(filePath, buffer)

    // Return the URL path (relative to public folder)
    const url = `/uploads/images/${filename}`

    return NextResponse.json({ 
      success: true, 
      url,
      filename 
    })
  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json({ error: 'Error uploading image' }, { status: 500 })
  }
}