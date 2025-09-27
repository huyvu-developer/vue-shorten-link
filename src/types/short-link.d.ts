import { User } from './user'
import { ClickLog } from './click-log'

export interface ShortLink {
  id: string | number
  originalUrl: string
  shortCode: string
  createdAt: string
  clickCount: number
  expiresAt?: string | null
  user: User
  clickLogs: ClickLog[]
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
  shortUrl: string
}

export interface ShortLinkRequestDto {
  originalUrl: string
  userId: string
}
