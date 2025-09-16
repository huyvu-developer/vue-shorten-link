import { ShortLink } from './short-link'
export interface User {
  id: string | number
  email: string
  fullName: string
  avatar?: string
  createdAt: string
  updatedAt: string
  deletedAt?: string
  address?: string
  phone?: string
  status: string
  shortLinks: ShortLink[] | null
}
