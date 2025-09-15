import axios from 'axios'

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export interface ShortenUrlRequest {
  url: string
  customAlias?: string
  expiresAt?: string
}

export interface ShortenUrlResponse {
  id: string
  originalUrl: string
  shortUrl: string
  shortCode: string
  createdAt: string
  expiresAt?: string
  clickCount: number
}

export interface UrlStats {
  id: string
  shortCode: string
  originalUrl: string
  shortUrl: string
  clickCount: number
  createdAt: string
  lastClickedAt?: string
  referrers: Array<{ referrer: string; count: number }>
  countries: Array<{ country: string; count: number }>
  browsers: Array<{ browser: string; count: number }>
  devices: Array<{ device: string; count: number }>
}

// API functions
export const urlShortenerApi = {
  // Shorten a URL
  async shortenUrl(data: ShortenUrlRequest): Promise<ShortenUrlResponse> {
    const response = await api.post<ShortenUrlResponse>('/urls', data)
    return response.data
  },

  // Get URL by short code
  async getUrl(shortCode: string): Promise<ShortenUrlResponse> {
    const response = await api.get<ShortenUrlResponse>(`/urls/${shortCode}`)
    return response.data
  },

  // Get URL statistics
  async getUrlStats(shortCode: string): Promise<UrlStats> {
    const response = await api.get<UrlStats>(`/urls/${shortCode}/stats`)
    return response.data
  },

  // Get user's URLs
  async getUserUrls(
    page = 1,
    limit = 10,
  ): Promise<{
    urls: ShortenUrlResponse[]
    total: number
    page: number
    limit: number
  }> {
    const response = await api.get(`/urls?page=${page}&limit=${limit}`)
    return response.data
  },

  // Delete URL
  async deleteUrl(shortCode: string): Promise<void> {
    await api.delete(`/urls/${shortCode}`)
  },

  // Update URL
  async updateUrl(
    shortCode: string,
    data: Partial<ShortenUrlRequest>,
  ): Promise<ShortenUrlResponse> {
    const response = await api.put<ShortenUrlResponse>(`/urls/${shortCode}`, data)
    return response.data
  },
}

export default api
