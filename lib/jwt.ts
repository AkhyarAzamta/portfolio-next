// lib/jwt.ts
import { SignJWT, jwtVerify } from 'jose'

export interface JWTPayload {
  userId: number
  email: string
  role: string
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? 'your-secret-key')

export async function generateToken(payload: JWTPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secret)
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    console.log('Token from cookie:', token)
    const { payload } = await jwtVerify(token, secret)
    // jwtVerify mengembalikan payload sebagai Record<string, any>
    return payload as unknown as JWTPayload
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}
