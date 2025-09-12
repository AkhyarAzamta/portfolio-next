// app/api/upload/route.ts
import { NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      )
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          upload_preset: 'portfolio_uploads',
        },
        (error, result) => {
          if (error) {
            reject(error)
            return
          }
          resolve(result)
        }
      ).end(buffer)
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}