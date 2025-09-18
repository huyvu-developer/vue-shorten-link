import Cookies from 'js-cookie'

const COOKIE_OPTIONS = {
  expires: 7, // 7 days
  secure: import.meta.env.PROD,
  sameSite: 'lax' as const,
  path: '/',
}

// Set access token
export const setCookie = (key: string, value: string) => {
  console.log('setCookie', key, value)
  Cookies.set(key, value, COOKIE_OPTIONS)
}

// Get access token
export const getCookie = (key: string): string | undefined => {
  return Cookies.get(key)
}

// Remove access token
export const removeCookie = (key: string) => {
  Cookies.remove(key, { path: '/' })
}

// Check if access token exists
export const hasCookie = (key: string): boolean => {
  return !!Cookies.get(key)
}
