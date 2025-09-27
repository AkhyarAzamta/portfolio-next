// lib/withAdminAuth.ts
import { NextResponse } from 'next/server'
  import { verifyToken } from '@/lib/jwt'

// Tipe untuk context params
export type ParamsLike = Record<string, string> | Promise<Record<string, string>>
export type Ctx = { params?: ParamsLike }

// Bentuk decoded token
type DecodedToken = { 
  id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
} | null

// Handler type yang kompatibel dengan Next.js App Router
type Handler = (
  request: Request,
  ctx: Ctx
) => Promise<Response | NextResponse>

export function withAdminAuth(handler: Handler) {
  return async (request: Request, ctx: Ctx) => {
    try {
      const authHeader = request.headers.get('authorization') || ''
      const token = authHeader.replace('Bearer ', '')

      if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const decoded = await verifyToken(token) as DecodedToken

      if (!decoded || decoded.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }

      return handler(request, ctx)
    } catch (err) {
      console.error('Auth error:', err)
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
    }
  }
}

// Handler khusus untuk route yang membutuhkan params
type HandlerWithParams<T = Record<string, string>> = (
  request: Request,
  ctx: { params: T }
) => Promise<Response | NextResponse>

export function withAdminAuthParams<T = Record<string, string>>(handler: HandlerWithParams<T>) {
  return async (request: Request, ctx: Ctx) => {
    try {
      const authHeader = request.headers.get('authorization') || ''
      const token = authHeader.replace('Bearer ', '')

      if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const decoded = await verifyToken(token) as DecodedToken

      if (!decoded || decoded.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }

      // Resolve params jika promise
      const params = ctx.params instanceof Promise ? await ctx.params : ctx.params
      
      if (!params) {
        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
      }

      return handler(request, { params: params as T })
    } catch (err) {
      console.error('Auth error:', err)
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
    }
  }
}