import { API_BASE_URL } from '@/constants/env'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { getCookie } from '@/utils/cookies'

type AxiosProxyOptions = {
  Authorization?: string
  Accept?: string
  'Content-Type'?: string
  AgentCode?: string
}

export function useAxiosProxy(options: AxiosProxyOptions = {}) {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: false,
    timeout: 10000,
  })

  let clientIp = localStorage.getItem('client-id')
  clientIp = localStorage.getItem('client-id')
  if (!clientIp) {
    clientIp = uuidv4()
    localStorage.setItem('client-id', clientIp)
  }

  instance.defaults.headers.common['Content-Type'] = 'application/json'
  instance.interceptors.request.use((request) => {
    console.log('[REQ]:', request.url, clientIp)
    console.log('[REQ Data]:', request.data)
    console.log('[REQ Headers]:', request.headers)

    // Auto-inject access token from cookies if available
    const accessToken = getCookie('accessToken')
    if (accessToken) {
      request.headers.set('Authorization', `Bearer ${accessToken}`)
    } else if (options?.Authorization && options?.Authorization !== 'Bearer undefined') {
      request.headers.set('Authorization', options?.Authorization || '')
    }

    request.headers.set('Agent-Code', clientIp || '')
    request.headers.set('Agent-Ip', clientIp || '')
    request.headers.set('Accept', options?.Accept || 'application/json')
    request.headers.set('Content-Type', options['Content-Type'] || 'application/json')

    console.log('[REQ Final Data]:', request.data)
    return request
  })
  instance.interceptors.response.use(
    (response) => {
      const transformed = response.data
      return Promise.resolve(transformed)
    },
    async (error) => {
      console.error(error.response)
      return Promise.reject(error.response)
    },
  )
  return instance
}
