import { ShortLink } from './short-link'
export interface ClickLog {
  id: string | number
  shortLink: ShortLink
  createdAt: string
  updatedAt: string
  clickedAt: string
  ipAddress?: string
  userAgent?: string
  country?: string
}
