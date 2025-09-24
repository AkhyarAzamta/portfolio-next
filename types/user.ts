import { Blog } from "./blog"

// Enum sesuai Prisma
export type UserRole = 'ADMIN' | 'USER'

/* --------------------- User --------------------- */
export interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: string
  title?: string
  bio?: string
  blogs?: Blog[]
  socialLinks?: {
    github?: string
    linkedin?: string
    instagram?: string
  }
}

export interface UserBasic {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string | null
  title?: string | null
  bio?: string | null
  githubUrl?: string | null
  linkedinUrl?: string | null
  instagramUrl?: string | null
  createdAt: string // ISO date
  updatedAt: string
}

// User create/update DTO (password included on create)
export interface UserCreateInput {
  name: string
  email: string
  password: string
  role?: UserRole
  avatar?: string | null
  title?: string | null
  bio?: string | null
  githubUrl?: string | null
  linkedinUrl?: string | null
  instagramUrl?: string | null
}

export interface UserUpdateInput {
  name?: string
  email?: string
  password?: string
  role?: UserRole
  avatar?: string | null
  title?: string | null
  bio?: string | null
  githubUrl?: string | null
  linkedinUrl?: string | null
  instagramUrl?: string | null
}

export interface User {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
  updatedAt: string
}

export interface CreateUserRequest {
  name: string
  email: string
  password: string
  role: 'USER' | 'ADMIN'
}

export interface UpdateUserRequest {
  name?: string
  email?: string
  password?: string
  role?: 'USER' | 'ADMIN'
}