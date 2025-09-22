// lib/jwt.ts
import { SignJWT, jwtVerify } from 'jose'

export interface JWTPayload {
  id: number
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
    const { payload } = await jwtVerify(token, secret)
    // jwtVerify mengembalikan payload sebagai Record<string, any>
    return payload as unknown as JWTPayload
  } catch (error) {
    console.error('Error verifying token:', error)
    return null
  }
}
