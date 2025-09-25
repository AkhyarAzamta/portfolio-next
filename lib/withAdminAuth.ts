// lib/withAdminAuth.ts
import { NextResponse } from 'next/server'

type ParamsLike = { id: string }
type Ctx = { params?: ParamsLike | Promise<ParamsLike> }

// bentuk decoded token yang kita harapkan (boleh diperluas nanti)
type DecodedToken = { role?: string } | null

// handler menerima Request (global) supaya kompatibel baik dengan Request maupun NextRequest
type Handler = (
  request: Request,
  ctx: Ctx,
  decoded: DecodedToken
) => Promise<Response | NextResponse>

import { verifyToken } from '@/lib/jwt'

export function withAdminAuth(handler: Handler) {
  return async (request: Request, ctx: Ctx) => {
    try {
      const authHeader = request.headers?.get?.('authorization') ?? ''
      const token = typeof authHeader === 'string' ? authHeader.replace('Bearer ', '') : ''

      if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      // verifyToken mungkin mengembalikan object atau null; kita ketik sebagai DecodedToken
      const decoded = (await verifyToken(token)) as DecodedToken

      if (!decoded || decoded.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }

      return handler(request, ctx, decoded)
    } catch (err) {
      console.error('Auth error:', err)
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
    }
  }
}
