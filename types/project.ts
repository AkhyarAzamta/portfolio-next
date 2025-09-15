// src/types.ts

// Enum sesuai Prisma
export type UserRole = 'ADMIN' | 'USER'

/**
 * Basic / minimal variants to avoid deep recursion when serializing relations
 * - UserBasic: tanpa password dan tanpa array blogs lengkap
 * - BlogBasic: tanpa content panjang dan tanpa author object full
 */
export interface UserBasic {
  id: number
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

export interface BlogBasic {
  id: number
  title: string
  excerpt: string
  slug: string
  published: boolean
  archived: boolean
  createdAt: string
  updatedAt: string
  authorId: number
}

/**
 * Full models (mirip shape di DB)
 * - fields that are nullable in Prisma are typed as `T | null`
 * - DateTime di Prisma direpresentasikan sebagai ISO string (string) pada API/JSON
 *
 * Note: relation properties (arrays/objects) dibuat optional (`?`) karena
 * mereka hanya ada jika di-populate/select di query.
 */

/* --------------------- User --------------------- */
export interface User {
  id: number
  name: string
  email: string
  password: string
  role: UserRole
  avatar?: string | null
  title?: string | null
  bio?: string | null
  githubUrl?: string | null
  linkedinUrl?: string | null
  instagramUrl?: string | null
  // relations
  blogs?: Blog[] // populated if included
  createdAt: string
  updatedAt: string
}

/* --------------------- Blog --------------------- */
export interface Blog {
  id: number
  title: string
  excerpt: string
  content?: string | null
  authorId: number
  // relation
  author?: UserBasic // optionally populated
  slug: string
  published: boolean
  archived: boolean
  createdAt: string
  updatedAt: string
}

/* --------------------- Project --------------------- */
export interface Project {
  id: string; // Changed from number to string
  title: string;
  description: string;
  technologies: string[];
  sourceCode: string | null;
  demoLink: string | null;
  image: string;
  archived: boolean;
  price: number | null;
  githubLink: string | null; // New field
  env: string | null; // New field
  password: string | null; // New field
  createdAt: string;
  updatedAt: string;
}

export interface ProjectsProps {
  limit?: number
  title?: string
  description?: string
  layout?: 'grid' | 'list'
  showViewAll?: boolean
}

/* --------------------- ContactMessage --------------------- */
export interface ContactMessage {
  id: number
  name: string
  email: string
  message: string
  read: boolean
  createdAt: string
  updatedAt: string
}

/* --------------------- About --------------------- */
export interface About {
  id: number
  bio: string
  createdAt: string
  updatedAt: string
}

/* --------------------- SkillCategory & Skill --------------------- */
export interface SkillCategory {
  id: number
  name: string
  icon: string
  description?: string | null
  // relation
  skills?: Skill[] // optionally populated
  createdAt: string
  updatedAt: string
}

export interface Skill {
  id: number
  name: string
  logo: string
  categoryId: number
  // relation
  category?: SkillCategory // optional
  createdAt: string
  updatedAt: string
}

/* --------------------- Experience --------------------- */
export interface Experience {
  id: number
  title: string
  company: string
  period: string
  description: string[]   // array of strings as per schema
  createdAt: string
  updatedAt: string
}

/* --------------------- Education --------------------- */
export interface Education {
  id: number
  degree: string
  institution: string
  period: string
  description?: string | null
  grade?: number | null
  createdAt: string
  updatedAt: string
}

/* --------------------- ContactInfo --------------------- */
export interface ContactInfo {
  id: number
  type: string
  value: string
  createdAt: string
  updatedAt: string
}

/* --------------------- Helper / DTO types --------------------- */
/**
 * DTOs untuk create/update bisa berguna di client/server.
 * Sesuaikan required/optional sesuai kebutuhan.
 */

// Project create/update DTO
export interface ProjectCreateInput {
  title: string
  description: string
  technologies: string[]
  sourceCode?: string | null
  demoLink?: string | null
  image: string
  archived?: boolean
  price?: number | null
}

export interface ProjectUpdateInput {
  title?: string
  description?: string
  technologies?: string[]
  sourceCode?: string | null
  demoLink?: string | null
  image?: string
  archived?: boolean
  price?: number | null
}

// Blog create/update DTO
export interface BlogCreateInput {
  title: string
  excerpt: string
  content?: string | null
  authorId: number
  slug: string
  published?: boolean
  archived?: boolean
}

export interface BlogUpdateInput {
  title?: string
  excerpt?: string
  content?: string | null
  slug?: string
  published?: boolean
  archived?: boolean
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

/* --------------------- Utility types --------------------- */
/**
 * A type that represents a paginated response
 */
export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

export interface Certificate {
  id: number;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string | null;
  credentialURL: string | null;
  image: string | null;
}

/* --------------------- Usage notes ---------------------
- createdAt / updatedAt typed as string (ISO) because API/JSON biasanya mengirim tanggal sebagai ISO strings.
  Jika kamu menggunakan Date objects on the server, convert to string before sending to client, or change
  these to `string | Date` if you want to accept both.

- Relation fields (e.g., User.blogs, Blog.author) are optional and only present if query populates them.

- Feel free to adapt DTOs names and fields for your API contracts.
------------------------------------------------------- */
