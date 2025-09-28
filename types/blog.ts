import { UserBasic } from "./user"

/* --------------------- Blog --------------------- */
export interface Blog {
  id: string
  title: string
  excerpt: string
  content?: string | null
  authorId: number
  viewCount: number
  image?: string | null
  coverImage?: string | null
  tags?: string[] // optional
  author?: UserBasic // optionally populated
  slug: string
  published: boolean
  createdAt: string
  updatedAt: string
}

// Blog create/update DTO
export interface BlogBasic {
  id: string
  title: string
  excerpt: string
  slug: string
  published: boolean
  createdAt: string
  updatedAt: string
  authorId: number
}

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  slug: string
  published: boolean
  viewCount: number
  tags: string[]
  createdAt: string
  updatedAt: string
  author: {
    name: string
    avatar: string | null
  }
}

export interface BlogUpdateInput {
  title?: string
  excerpt?: string
  content?: string | null
  slug?: string
  published?: boolean
}

export interface BlogFormProps {
  blog?: {
    id: string
    title: string
    excerpt: string
    content: string
    published: boolean
  }
}