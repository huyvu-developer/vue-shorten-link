import type { ApiResponse } from '@/types/common'
import { useAxiosProxy } from '@/utils/axios'
import type { ShortLinkAnalytics, Statistics, AgentAnalytics } from '@/types/dashboard'

const instance = useAxiosProxy()

const getStatistics = async (
  startDate: string,
  endDate: string,
): Promise<ApiResponse<Statistics>> => {
  return await instance.get('/statistics', {
    params: {
      startDate,
      endDate,
    },
  })
}

const getAnalyticsChart = async (
  analyticsType: 'short-link' | 'click-count',
  startDate: string,
  endDate: string,
): Promise<ApiResponse<ShortLinkAnalytics[]>> => {
  return await instance.get(`/statistics/${analyticsType}-chart`, {
    params: {
      startDate,
      endDate,
    },
  })
}

const getAgentAnalytics = async (
  agentType: 'browser' | 'device' | 'os',
  startDate: string,
  endDate: string,
): Promise<ApiResponse<AgentAnalytics[]>> => {
  return await instance.get(`/statistics/${agentType}-chart`, {
    params: {
      startDate,
      endDate,
    },
  })
}

export default {
  getStatistics,
  getAnalyticsChart,
  getAgentAnalytics,
}
