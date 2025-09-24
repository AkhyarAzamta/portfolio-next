/* --------------------- About --------------------- */
export interface About {
  id: number
  bio: string
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

export interface Certificate {
  id: number;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string | null;
  credentialURL: string | null;
  image: string | null;
}
export interface Education {
  id: number;
  degree: string;
  institution: string;
  period: string;
  description?: string | null;
}
export interface LanguageSkill {
  id: number;
  name: string;
  level: number;
  category: string | null;
  logo: string | null;
}