export interface DashboardStats {
  totalBlogs: number
  totalProjects: number
  totalContacts: number
  unreadContacts: number
  recentBlogs: { id: number; title: string; published: boolean; createdAt: string; slug?: string }[]
  recentProjects: { id: number; title: string; status: string; createdAt: string; slug?: string }[]
  recentContacts: { id: number; name: string; email: string; read: boolean; date: string }[]
}