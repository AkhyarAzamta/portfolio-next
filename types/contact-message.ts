export interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  read: boolean
  createdAt: string
  updatedAt?: string
}

export interface ContactRequestBody {
  name: string
  email: string
  message: string
}