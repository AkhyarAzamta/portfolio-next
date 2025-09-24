// app/api/contact/[id]/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

type Context = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, ctx: Context) {
  try {
    const params = await ctx.params
    const id = params.id
    const body = await request.json()

    const updatedContact = await prisma.contactMessage.update({
      where: { id },
      data: {
        read: body.read
      }
    })

    return NextResponse.json(updatedContact)
  } catch (error) {
    console.error('Error updating contact message:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request, ctx: Context) {
  try {
    const params = await ctx.params
    const id = params.id

    await prisma.contactMessage.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Contact message deleted successfully' })
  } catch (error) {
    console.error('Error deleting contact message:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}