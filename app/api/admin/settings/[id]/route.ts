// app/api/admin/settings/[id]/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { withAdminAuth } from '@/lib/withAdminAuth'

export const GET = withAdminAuth(async (request, ctx) => {
  // handle both ctx.params or Promise<params>
  const params = await Promise.resolve(ctx?.params)
  const id = params?.id ? String(params.id) : null

  if (!id) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  const siteSettings = await prisma.siteSettings.findUnique({
    where: { id }
  })

  if (!siteSettings) {
    return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
  }

  return NextResponse.json(siteSettings)
})

export const PUT = withAdminAuth(async (request, ctx) => {
  const params = await Promise.resolve(ctx?.params)
  const id = params?.id ? String(params.id) : null
  if (!id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  const body = await request.json()
  const { key, value, type, category, label, description, options, order } = body ?? {}

  // Validate required fields and coerce types
  const validatedKey = typeof key === 'string' ? key.trim() : undefined
  const validatedValue = value !== undefined && value !== null ? String(value) : undefined
  const validatedType = typeof type === 'string' ? type.trim() : undefined
  const validatedCategory = typeof category === 'string' ? category.trim() : undefined
  const validatedLabel = typeof label === 'string' ? label.trim() : undefined
  const validatedDescription = typeof description === 'string' ? description.trim() : null
  const validatedOptions = Array.isArray(options)
    ? options.filter((opt) => typeof opt === 'string').map((opt) => opt.trim())
    : typeof options === 'string'
      ? options.split(',').map((opt) => opt.trim())
      : undefined
  const validatedOrder = typeof order === 'number' && !isNaN(order) ? order : undefined

  if (!validatedKey || validatedValue === undefined || !validatedType || !validatedCategory || !validatedLabel || validatedOrder === undefined) {
    return NextResponse.json({ error: 'Missing required fields or value is undefined' }, { status: 400 })
  }

  const updated = await prisma.siteSettings.update({
    where: { id },
    data: {
      key: validatedKey,
      value: validatedValue,
      type: validatedType,
      category: validatedCategory,
      label: validatedLabel,
      description: validatedDescription,
      options: validatedOptions ? JSON.stringify(validatedOptions) : null,
      order: validatedOrder,
    },
  })

  const formattedSetting = {
    ...updated,
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
    description: updated.description ?? undefined,
    options: updated.options ? JSON.parse(updated.options) : undefined,
  }

  return NextResponse.json(formattedSetting)
})

export const DELETE = withAdminAuth(async (request, ctx) => {
  const params = await Promise.resolve(ctx?.params)
  const id = params?.id ? String(params.id) : null
  if (!id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  await prisma.siteSettings.delete({ where: { id } })
  return NextResponse.json({ message: 'Setting deleted successfully' })
})