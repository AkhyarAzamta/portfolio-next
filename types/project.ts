// src/types.ts
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
  slug?: string; // New field
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

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}
