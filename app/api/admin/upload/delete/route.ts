// app/api/admin/upload/delete/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { deleteUploadedFileServer } from '@/lib/uploadUtils'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    await deleteUploadedFileServer(url)

    return NextResponse.json({ 
      success: true, 
      message: 'File deleted successfully' 
    })
  } catch (error) {
    console.error('Error in upload delete API:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete file' 
    }, { status: 500 })
  }
}